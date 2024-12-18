import { Request } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import {
    PrismaClient,
} from "@prisma/client";


const prisma = new PrismaClient()


export const getBidDetailsDal = async (req: Request) => {
    const { reference_no } = req.params
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const result: any = await prisma.bid_details.findFirst({
            where: { reference_no: reference_no },
            select: {
                reference_no: true,
                bid_type: true,
                no_of_bidders: true,
                status: true,
                creationStatus: true,
                boq: {
                    select: {
                        pre_tendering_details: {
                            select: {
                                tendering_type: true,
                                is_rate_contract: true,
                                emd: true
                            }
                        }
                    }
                },
                bidder_master: {
                    where: { has_lost: false },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        name: true,
                        gst_no: true,
                        pan_no: true,
                        address: true,
                        bank: true,
                        account_no: true,
                        ifsc: true,
                        emd: true,
                        emd_doc: true,
                        payment_mode: true,
                        offline_mode: true,
                        dd_no: true,
                        transaction_no: true,
                        bidder_doc: true,
                        bidding_amount: true,
                    }
                },
                comparison: {
                    select: {
                        id: true,
                        bidder_master: {
                            select: {
                                id: true,
                                name: true,
                                gst_no: true,
                                pan_no: true,
                                address: true,
                                bank: true,
                                account_no: true,
                                ifsc: true,
                                emd: true,
                                emd_doc: true,
                                payment_mode: true,
                                offline_mode: true,
                                dd_no: true,
                                transaction_no: true,
                                bidder_doc: true,
                                bidding_amount: true,
                            }
                        },
                        comparison_criteria: {
                            select: {
                                criteria: {
                                    select: {
                                        id: true,
                                        heading: true,
                                        description: true
                                    }
                                },
                                value: true
                            }
                        }
                    }
                }
            }
        })


        const techCriteria = await prisma.criteria.findMany({
            where: { reference_no: reference_no, criteria_type: 'technical' },
            select: {
                id: true,
                criteria_type: true,
                heading: true,
                description: true
            }
        })

        const finCriteria = await prisma.criteria.findMany({
            where: { reference_no: reference_no, criteria_type: 'financial' },
            select: {
                id: true,
                criteria_type: true,
                heading: true,
                description: true
            }
        })

        const techComparison = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'technical'
                        }
                    }
                }
            }
        })

        const finComparison = await prisma.comparison.count({
            where: {
                reference_no: reference_no,
                comparison_criteria: {
                    some: {
                        criteria: {
                            criteria_type: 'financial'
                        }
                    }
                }
            }
        })

        if (result) {
            result.techCriteria = techCriteria
            result.finCriteria = finCriteria
            result.techComparison = techComparison === 0 ? false : true
            result.finComparison = finComparison === 0 ? false : true
        }

        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}



export const getProcurementDetailsByRefNoDal = async (req: Request) => {
    const { reference_no } = req.params
    try {

        if (!reference_no) {
            throw { error: true, message: "Reference number is required as 'reference_no'" }
        }

        const boq = await prisma.boq.findFirst({
            where: {
                reference_no: reference_no
            },
            select: {
                procurement_no: true
            }
        })

        const procStock = await prisma.procurement_stocks.findMany({
            where: {
                procurement_no: boq?.procurement_no as string
            },
            select: {
                id: true,
                description: true
            }
        })

        const supplier = await prisma.supplier_master.findMany({
            where: {
                procurement_no: boq?.procurement_no as string
            },
            select: {
                id: true,
                name: true
            }
        })

        return {
            reference_no: reference_no,
            procurement_no: boq?.procurement_no,
            procurement_stock: procStock,
            supplier: supplier
        }
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}

export const getRateContractDetailsNoDal = async (req: Request) => {
    const { category } = req.params
    try {

        if (!category) {
            throw { error: true, message: "Category is required as 'reference_no'" }
        }

        const result = await prisma.rate_contract.findMany({
            where: {
                category_masterId: category as string
            },
            select: {
                id: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                subcategory: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                unit: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true
                    }
                },
                description: true,
                rate_contract_supplier: {
                    select: {
                        id: true,
                        unit_price: true,
                        supplier_master: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}


export const getAllRateContractDetailsNoDal = async (req: Request) => {
    console.log("here called");
    const { category } = req.params;

    // Validate if the category is provided
    if (!category) {
        throw { error: true, message: "Category is required as 'category'" };
    }

    try {
        // Fetch rate contract details by category
        const result = await prisma.rate_contract.findMany({
            where: {
                category_masterId: category as string,  // Filtering by the category parameter
            },
            select: {
                rate_contract_supplier: {
                    select: {
                        id: true,
                        unit_price: true,
                        supplier_master: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        // Flatten the result into a single array
        const flatSuppliers = result.flatMap(contract =>
            contract.rate_contract_supplier.map(supplier => ({
                id: supplier.id,
                unit_price: supplier.unit_price,
                supplier_master: supplier.supplier_master ? {
                    id: supplier.supplier_master?.id,
                    name: supplier.supplier_master?.name,
                } : null,
            }))
        );
        

        // Return the structured response in the correct format
        return {
            status: true,
            message: "Rate contract details fetched successfully",
            data: flatSuppliers,  // Return the flattened array
        };

    } catch (err: any) {
        console.error(err);
        return { error: true, message: getErrorMessage(err) };
    }
};

export const getBidderByIdDal = async (req: Request) => {
    const { id } = req.params
    try {

        if (!id) {
            throw { error: true, message: "ID is required as 'id'" }
        }

        const result = await prisma.bidder_master.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                reference_no: true,
                name: true,
                gst_no: true,
                pan_no: true,
                address: true,
                bank: true,
                account_no: true,
                ifsc: true,
                emd: true,
                emd_doc: true,
                payment_mode: true,
                offline_mode: true,
                dd_no: true,
                dd_date: true,
                dd_bank: true,
                dd_transaction_no: true,
                bg_no: true,
                bg_date: true,
                bg_bank: true,
                bg_transaction_no: true,
                transaction_no: true,
                bidding_amount: true
            }
        })

        return result
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}