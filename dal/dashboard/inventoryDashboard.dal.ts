import { Console } from 'console';
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient, service_enum } from '@prisma/client'

const prisma = new PrismaClient()

interface GroupedData {
	week?: string;
	month?: string;
	year?: number;
	count: number;
}

// function getWeekNumber(date: Date): number {
// 	const firstDayOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
// 	const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
// 	return Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
// }

function getFormattedDateMMDD(date: Date): string {
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // months are zero-indexed
	const day = date.getUTCDate().toString().padStart(2, '0');
	return `${month}-${day}`;
}

// Function to get the start and end of the current week (Sunday to Saturday)
function getCurrentWeekRange(): Date[] {
	const today = new Date();
	const startOfWeek = new Date(today);
	startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay()); // Set to Sunday

	const weekRange: Date[] = [];
	for (let i = 0; i < 7; i++) {
		const day = new Date(startOfWeek);
		day.setUTCDate(startOfWeek.getUTCDate() + i);
		weekRange.push(day);
	}

	return weekRange;
}

// Function to get all months from the start of the current year to the current month
function getCurrentYearMonthRange(): Date[] {
	const months: Date[] = [];
	const today = new Date();
	const currentYear = today.getFullYear();

	// Loop through all months from January to December
	for (let month = 1; month <= 12; month++) {
		// Create a date for the first day of each month
		const date = new Date(currentYear, month, 1);
		months.push(date);
	}

	// Sort the array to ensure chronological order
	months.sort((a, b) => a.getTime() - b.getTime());

	return months;
}

// Get the full range of 7 days in the current week
const weekRange = getCurrentWeekRange();
const monthRange = getCurrentYearMonthRange();

// Function to group by weekly, monthly, and yearly
function groupByPeriod(data: any): {
	weekly: GroupedData[];
	monthly: GroupedData[];
	yearly: GroupedData[];
} {
	const weekly: Record<string, GroupedData> = {};
	const monthly: Record<string, GroupedData> = {};
	const yearly: Record<number, GroupedData> = {};

	// Initialize all 7 days of the current week with count = 0
	weekRange.forEach((date) => {
		const week = getFormattedDateMMDD(date);
		weekly[week] = { week: week, count: 0 };
	});

	// Initialize months of the current year with count = 0
	monthRange.forEach((date) => {
		const month = date.toISOString().split('T')[0].slice(0, 7);
		monthly[month] = { month: month, count: 0 };
	});

	data.forEach((entry: any) => {
		const date = new Date(entry.createdAt);

		// Group by week (ISO week number)
		const week = getFormattedDateMMDD(date);
		if (weekly[week]) {
			weekly[week].count += entry._count._all;
		}

		// Group by month (YYYY-MM)
		const month = date.toISOString().split('T')[0].slice(0, 7);
		if (monthly[month]) {
			monthly[month].count += entry._count._all;
		}
		const year = date.getUTCFullYear();
		if (!yearly[year]) {
			yearly[year] = { year: year, count: 0 };
		}
		yearly[year].count += entry._count._all;
	});

	return {
		weekly: Object.values(weekly),
		monthly: Object.values(monthly),
		yearly: Object.values(yearly),
	};
}

export const getInventoryDashboardDal = async (service: service_enum) => {
	try {
		// Run the query to get the createdAt field and the counts
		const getData = async () => {
			const data = await prisma.service_request.groupBy({
				where: {
					service: service,
					status: 23
				},
				by: ['createdAt'],
				_count: {
					_all: true,
				},
			});
			return data
		};
		const data: any = await getData()

		return groupByPeriod(data)
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getAssignedStocksDal = async () => {
	try {
		// Run the query to get the createdAt field and the counts
		const getData = async () => {
			return await prisma.stock_handover.groupBy({
				where: {
					is_alloted: true
				},
				by: ['createdAt'],
				_count: {
					_all: true,
				},
			});
		};

		const data: any = await getData()

		return groupByPeriod(data)
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getCountsDal = async () => {
	try {

		const schema: any = await prisma.$queryRawUnsafe(`
			SELECT table_name
			FROM information_schema.tables
			WHERE table_schema = 'product'
		  `);

		if (schema?.length === 0) {
			throw new Error('No product')
		}

		const total: any[] = await prisma.$queryRawUnsafe(
			`
			SELECT SUM(opening_quantity) AS total_sum
			FROM ${schema.map((table: any) => `product.${table.table_name}`).join(' UNION ALL SELECT SUM(opening_quantity) AS total_sum FROM ')}
		`);

		const remaining: any[] = await prisma.$queryRawUnsafe(
			`
			SELECT SUM(quantity) AS total_sum
			FROM ${schema.map((table: any) => `product.${table.table_name}`).join(' UNION ALL SELECT SUM(quantity) AS total_sum FROM ')}
		`);

		const dead = await prisma.inventory_dead_stock.aggregate({
			_sum: {
				quantity: true
			}
		})

		const movement = await prisma.stock_req_product.aggregate({
			where: {
				stock_request: {
					status: {
						notIn: [-2, -1, 0, 1, 2, 80, 81, 82]
					}
				}
			},
			_sum: {
				quantity: true
			}
		})

		return {
			totalStocks: total[0].total_sum,
			remainingStocks: remaining[0].total_sum,
			deadStocks: dead?._sum?.quantity,
			stocksInMovement: movement?._sum?.quantity
		}

	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}