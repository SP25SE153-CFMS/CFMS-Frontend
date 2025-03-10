/**
 * Exports an array of objects to a CSV file and triggers a download.
 * 
 * @param {Object[]} data - The array of objects to be converted into CSV format.
 * @param {string} [filename="data.csv"] - The name of the CSV file to be downloaded.
 */
export const downloadCSV = (data: any[], filename: string = "data.csv") => {
    if (!data || data.length === 0) return;

    // Extract headers from the first object, enclosing each in double quotes
    const headers = Object.keys(data[0]).map((key) => `"${key}"`).join(",") + "\n";

    // Convert each object into a CSV row with values in double quotes
    const rows = data
        .map((obj) =>
            Object.values(obj)
                .map((value) => `"${String(value).replace(/"/g, '""')}"`) // Escape double quotes
                .join(",")
        )
        .join("\n");

    // Create the CSV file content
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);

    // Create a temporary link element and trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
