export type pagination = {
	next?: {
		page: number
		take: number
	}
	prev?: {
		page: number
		take: number
	}
	currentPage?: number
	currentTake?: number
	totalPage?: number
	totalResult?: number
}

export type uploadedDoc = {
	ReferenceNo: string
	uniqueId: string
}

export type errorType = {
	error: boolean
	message: any
}
