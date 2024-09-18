import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
}

function getFormattedDateMMDD(date: Date): string {
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // months are zero-indexed
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${month}-${day}`;
}

export const getInventoryDashboardDal = async () => {
    try {

        // const today = new Date();

        // const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        // startOfWeek.setHours(0, 0, 0, 0);

        // const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
        // endOfWeek.setHours(23, 59, 59, 999);

        // const dailyCountForWeek = await prisma.service_request.groupBy({
        // 	by: ['createdAt'],
        // 	_count: {
        // 		_all: true,
        // 	},
        // 	where: {
        // 		createdAt: {
        // 			gte: new Date('2024-09-01'),
        // 			lte: new Date('2024-09-10'),
        // 		},
        // 	},
        // 	orderBy: {
        // 		createdAt: 'asc',
        // 	},
        // });

        // const groupedData = dailyCountForWeek.reduce((acc: any, entry) => {
        // 	const date = new Date(entry.createdAt).toISOString().split('T')[0]; // Extract only the date (YYYY-MM-DD)

        // 	if (!acc[date]) {
        // 		acc[date] = { date: date, count: 0 }; // Initialize if date not in accumulator
        // 	}

        // 	acc[date].count += entry._count._all; // Sum the count for the same date

        // 	return acc;
        // }, {});
        // const weekly = Object.values(groupedData);


        interface GroupedData {
            week?: string;
            month?: string;
            year?: number;
            count: number;
        }

        interface ServiceRequestData {
            createdAt: string; // Prisma returns dates as strings in ISO format
            _count: {
                _all: number;
            };
        }

        // Run the query to get the createdAt field and the counts
        const getData = async () => {
            return await prisma.service_request.groupBy({
                where: {
                    service: 'return'
                },
                by: ['createdAt'],
                _count: {
                    _all: true,
                },
            });
        };

        // Function to group by weekly, monthly, and yearly
        function groupByPeriod(data: ServiceRequestData[]): {
            weekly: GroupedData[];
            monthly: GroupedData[];
            yearly: GroupedData[];
        } {
            const weekly: Record<string, GroupedData> = {};
            const monthly: Record<string, GroupedData> = {};
            const yearly: Record<number, GroupedData> = {};

            data.forEach((entry) => {
                const date = new Date(entry.createdAt);

                // Group by week (ISO week number)
                const week = getFormattedDateMMDD(date);
                if (!weekly[week]) {
                    weekly[week] = { week: week, count: 0 };
                }
                weekly[week].count += entry._count._all;

                // Group by month (YYYY-MM)
                const month = date.toISOString().split('T')[0].slice(0, 7);
                if (!monthly[month]) {
                    monthly[month] = { month: month, count: 0 };
                }
                monthly[month].count += entry._count._all;

                // Group by year (YYYY)
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

        const data: any = await getData()

        return groupByPeriod(data)
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
