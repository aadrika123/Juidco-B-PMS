function isUUID(value: string) {
    // Regular expression to check if a string is a valid UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    // Test the string against the regular expression
    return uuidRegex.test(value);
}

export default isUUID