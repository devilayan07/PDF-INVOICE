import React, { useState } from 'react'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { numberToWords } from '../../utility/utility';
pdfMake.addVirtualFileSystem(pdfFonts);


function Invoice({ userData }) {
    console.log(userData)
    const { invoiceDetails, supplierDetails, recipientDetails, taxDetails, netAmount, itemKart, paymentDetails } = userData
    const [pdfurl, setPdfUrl] = useState(null)

    const totalAmount = itemKart.reduce((sum, item) => sum + item.total, 0).toFixed(2)
    console.log(totalAmount)
    const Quantity = itemKart.reduce((sum, item) => sum + item.quantity, 0).toFixed(2)
    console.log(Quantity)
    const Discount = itemKart.reduce((b1, b2) => b1 + b2.discount, 0).toFixed(2)
    console.log(Discount)
    const Gst = itemKart.reduce((sum, item) => sum + item.cgst + item.igst + item.sgst, 0).toFixed(2)
    console.log(Gst)
    const Tax = itemKart.reduce((sum, item) => sum + item.taxableValue, 0).toFixed(2)
    console.log(Tax)
    const totalDueAmount=paymentDetails.reduce((sum,item)=> sum+item.dueAmount,0)
    console.log(totalDueAmount)
    const amountInWords = numberToWords(Math.floor(totalDueAmount)) + " only";
    console.log(amountInWords)

    const toDataURL = (url, callback) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    };


    const createPdf = () => {
        const imageUrl = "https://cdn.thebrandingjournal.com/wp-content/uploads/2019/05/chanel_logo_the_branding_journal.jpg";


        toDataURL(imageUrl, function (base64Image) {

            const docDefinition = {
                pageSize: "A4",
                pageMargins: [10, 180, 10, 50], // Adjusted margins to align table with the border

                background: function () {
                    return {
                        canvas: [
                            {
                                type: "rect",
                                x: 10,
                                y: 10,
                                w: 575,
                                h: 822,
                                lineWidth: 0.01,
                                r: 5,
                                // dash: { length: 3, space: 3 }
                            },
                        ],
                    };
                },

                header: function (currentPage, pageCount) {
                    return [
                        {
                            margin: [20, 20, 20, 2],
                            stack: [
                                {
                                    columns: [
                                        {
                                            stack: [
                                                { text: `${supplierDetails.name}`, bold: true, margin: [0, 0, 0, 0] },
                                                {
                                                    text: `${supplierDetails.address.split(" ").join("\n")}\nContact: ${supplierDetails.phone}\nEmail: ${supplierDetails.email}\nGSTIN: ${supplierDetails.gstin}`,
                                                    margin: [0, 0, 0, 0], fontSize: 6
                                                }
                                            ],
                                            width: "50%",
                                            style: "supplier"
                                        },
                                        {
                                            stack: [
                                                { text: "TAX INVOICE", bold: true, margin: [0, 20, 0, 0] },
                                                { text: `Invoice No: ${invoiceDetails.displayId}`, style: "taxvoice" },
                                                { text: `Date: ${new Date(invoiceDetails.invoiceDate).toLocaleDateString()}`, style: "taxvoice" }
                                            ],
                                            width: "50%",
                                            alignment: "right"
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            stack: [
                                                { text: "Bill To", fontSize: 5 },
                                                { text: recipientDetails.name, margin: [0, 5, 0, 0], bold: true },
                                                { text: `Contact: ${recipientDetails.phone}`, fontSize: 6, margin: [0, 2, 0, 0] },
                                                { text: `Email: ${recipientDetails.email}`, fontSize: 6 }
                                            ],
                                            width: "33%"
                                        },
                                        {
                                            stack: [
                                                { text: "Ship To", fontSize: 5 },
                                                { text: recipientDetails.name, margin: [0, 5, 0, 0], bold: true },
                                                { text: `Contact: ${recipientDetails.phone}`, fontSize: 6, margin: [0, 2, 0, 0] },
                                                { text: `Email: ${recipientDetails.email}`, fontSize: 6 }
                                            ],
                                            width: "33%"
                                        },
                                        {
                                            stack: [
                                                {
                                                    image: base64Image,
                                                    fit: [80, 50],
                                                    alignment: "right",
                                                    margin: [0, 0, 0, 5]
                                                }
                                            ],
                                            width: "33%"
                                        }
                                    ]
                                }
                            ]
                        }
                    ];
                },

                content: [
                    {
                        margin: [10, 10, 10, 10],
                        table: {
                            headerRows: 1,
                            widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*"], // Makes table full width
                            body: [
                                [
                                    { text: "Item", style: "tableText", margin: [2, 8, 0, 5] },
                                    { text: "HSN SAC", style: "tableText", margin: [2, 8, 0, 5] },
                                    { text: "Rate", style: "tableHeader", margin: [0, 8, 2, 5] },
                                    { text: "Qty", style: "tableHeader", margin: [0, 8, 2, 5] },
                                    { text: "Disc", style: "tableHeader", margin: [0, 8, 2, 5] },
                                    { text: "Taxable Value", style: "tableHeader", margin: [0, 8, 2, 5] },
                                    { text: "GST%", style: "tableHeader", margin: [0, 8, 2, 5] },
                                    { text: "GST", style: "tableHeader", margin: [0, 8, 2, 5] },
                                    { text: "Amount", style: "tableHeader", margin: [0, 8, 2, 5] }
                                ],
                                ...itemKart.map((item) => [
                                    { text: item.itemName, style: "tableTextBody", margin: [4, 8, 0, 5] },
                                    { text: item.hsnSacCode, style: "tableTextBody", margin: [4, 8, 0, 5] },
                                    { text: item.unitPrice.toFixed(2), style: "tableFirstBody", margin: [2, 8, 4, 5] },
                                    { text: item.quantity.toFixed(2), style: "tableFirstBody", margin: [2, 8, 4, 5] },
                                    { text: item.discount.toFixed(2), style: "tableFirstBody", margin: [2, 8, 4, 5] },
                                    { text: item.taxableValue.toFixed(2), style: "tableFirstBody", margin: [2, 8, 4, 5] },
                                    { text: (item.taxableValue / item.total * 100).toFixed(2) || 0.00, style: "tableFirstBody", margin: [2, 8, 4, 5] },
                                    { text: (item.cgst + item.sgst + item.igst).toFixed(2) || 0, style: "tableFirstBody", margin: [2, 8, 4, 5] },
                                    { text: item.total.toFixed(2), style: "tableFirstBody", margin: [2, 8, 4, 5] }

                                ])
                            ]
                        },
                        layout: {
                            hLineWidth: () => 0.5,
                            vLineStyle: () => ({ dash: { length: 3, space: 5 } }),
                            hLineStyle: () => ({ dash: { length: 3, space: 3 } }),
                            paddingLeft: () => 0,
                            paddingRight: () => 0,
                            paddingTop: () => 0,
                            paddingBottom: () => 0,
                        }
                    },

                    {
                        columns: [
                            { text: "", },
                            { text: "", },
                            { text: "", },
                            { text: Quantity, fontSize: 10, margin: [25, 0, 2, 0] },
                            { text: Discount, fontSize: 10, margin: [30, 0, 0, 0] },
                            { text: Tax, fontSize: 10, margin: [7, 0, 3, 0] },
                            { text: "", },
                            { text: Gst, fontSize: 10, margin: [28, 0, 0, 0] },
                            { text: totalAmount, bold: true, fontSize: 10, margin: [6, 0, 5, 0] }

                        ],
                        margin: [15, 0, 0, 0]
                    },
                    {
                        canvas: [{ type: "line", x1: 3, y1: 5, x2: 557, y2: 5, lineWidth: 1, dash: { length: 2, space: 2 } }],
                        margin: [7, 1, 6, 0],
                    },






                    {
                        margin: [5, 0, 4, 0],
                        table: {
                            headerRows: 2,
                            body: [
                                [
                                    { text: "Bank Details", style: "tableBank" },
                                    { text: "Tax Summary", style: "tableBank" }

                                ],
                                [
                                    {
                                        stack: [
                                            { text: "Your Bank Details Here", style: "bankDetailsText" }

                                        ]
                                    },
                                    [
                                        {
                                            table: {
                                                headerRows: 2,

                                                body: [

                                                    [

                                                        { text: "HSN SAC", style: "tableSubHeader", margin: [0, 5, 0, 0] },
                                                        { text: "TAXABLE", style: "tableSubHeader", alignment: "right", margin: [0, 5, 0, 0] },
                                                        { text: "TAX%", style: "tableSubHeader", alignment: "right", margin: [2, 5, 0, 0] },
                                                        { text: "IGST", colSpan: 2, alignment: "center", style: "tableSubHeader" }, {},
                                                        { text: "CGST", colSpan: 2, alignment: "center", style: "tableSubHeader" }, {},
                                                        { text: "SGST", colSpan: 2, alignment: "center", style: "tableSubHeader" }, {},
                                                        { text: "Total", style: "tableSubHeader", alignment: "right" }

                                                    ],
                                                    ["", "", "", "Rate (%)", "Amount", "Rate (%)", "Amount", "Rate (%)", "Amount", ""],

                                                    ...itemKart.map((item) => [
                                                        { text: item.hsnSacCode, style: "tableBody", },
                                                        { text: item.taxableValue.toFixed(2), style: "tableBody", alignment: "right" },
                                                        { text: item.unitPrice, style: "tableBody", alignment: "right" },
                                                        { text: item.igstPercentage || 0, style: "tableBody", alignment: "right" },
                                                        { text: item.igstAmount || 0, style: "tableBody", alignment: "right" },
                                                        { text: item.cgstPercentage || 0, style: "tableBody", alignment: "right" },
                                                        { text: item.cgstAmount || 0, style: "tableBody", alignment: "right" },
                                                        { text: item.sgstPercentage || 0, style: "tableBody", alignment: "right" },
                                                        { text: item.sgstAmount || 0, style: "tableBody", alignment: 'right' },

                                                        { text: item.total.toFixed(2) || "", style: "tableBody", alignment: "right" },

                                                    ])

                                                ]
                                            },

                                            layout: {
                                                hLineWidth: function (i, node) {
                                                    return i === 0 || i === node.table.body.length ? 1 : 0.5;
                                                },
                                                vLineWidth: function (i, node) {
                                                    return i === 0 || i === node.table.widths.length ? 1 : 0.5;
                                                },
                                                hLineStyle: function (i, node) {
                                                    return { dash: { length: 2, space: 2 } }; // Dotted Horizontal lines
                                                },
                                                vLineStyle: function (i, node) {
                                                    return { dash: { length: 2, space: 2 } };
                                                }
                                            }



                                        }
                                    ],
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return 0.5;
                            },
                            vLineWidth: function (i, node) {
                                return 0.5;
                            },
                            hLineStyle: function (i, node) {
                                return { dash: { length: 2, space: 2 } }; // Dotted horizontal lines
                            },
                            vLineStyle: function (i, node) {
                                return { dash: { length: 2, space: 2 } };
                            }
                        }

                    },





                    {
                        margin: [0, 0, 0, 0],
                        columns: [
                            { text: "Tax Summary:Add tax summary details here", width: "100%", alignment: "center", fontSize: 8 }
                        ],

                    },

                    {
                        canvas: [{ type: "line", x1: 3, y1: 5, x2: 575, y2: 5, lineWidth: 1, dash: { length: 2, space: 2 } }],
                        margin: [0, 2, 0, 2],
                    },

                    ...(paymentDetails && paymentDetails.length > 0 ? [
                        {
                            columns: [
                                { text: "Previous Balance & Payments Details", margin: [20, 10, 0, 0] }
                            ]
                        },
                        {
                            margin: [20, 10, 0, 0],

                            table: {
                                headerRows: 2,
                                widths: [57, 57, 57, 57, 57, 57, 57, 57],
                                body: [
                                    [
                                        { text: "Invoice No.", style: "invoiceStyle" },
                                        { text: "Date", style: "invoiceStyle" },
                                        { text: "Case Id", style: "invoiceStyle" },
                                        { text: "Inv. Amount", style: "invoiceStyle" },
                                        { text: "Disc. Amount", style: "invoiceStyle" },
                                        { text: "Net Amount", style: "invoiceStyle" },
                                        { text: "Paid Amount", style: "invoiceStyle" },
                                        { text: "Due Amount", style: "invoiceStyle" }
                                    ],






                                    ...paymentDetails.map((item) => [
                                        { text: item.invoiceNo, alignment: "right", fontSize: 7 },
                                        { text: new Date(item.invoiceDate).toLocaleDateString(), alignment: "right", fontSize: 7 },
                                        { text: item.caseId, alignment: "right", fontSize: 7 },
                                        { text: item.invoiceAmount.toFixed(2), alignment: "right", fontSize: 7 },
                                        { text: item.discount.toFixed(2), alignment: "right", fontSize: 7 },
                                        { text: (item.invoiceAmount - item.discount).toFixed(2), alignment: "right", fontSize: 7 },
                                        { text: item.paidAmount.toFixed(2), alignment: "right", fontSize: 7 },
                                        { text: item.dueAmount.toFixed(2), alignment: "right", fontSize: 7, color: "red" }

                                    ])
                                ]
                            }
                        },


                    ] : []),

                    {
                        columns: [
                            { text: `Amount Due(in words):${amountInWords}`, margin: [20, 5, 0, 0], fontSize: 8, bold: true },
                        ]
                    },
                    {
                        columns: [
                            { text: "Total Outstanding Amount:", color: "red", margin: [20, 3, 0, 0], fontSize: 8 }
                        ]
                    },
                    {
                        columns: [
                            { text: "Terms & Conditions:", bold: true, fontSize: 8, margin: [20, 10, 0, 0] }
                        ]
                    },
                    {
                        columns: [
                            {
                                stack: [
                                    {
                                        ul: [
                                            { text: "All disputes are subject to Hyderabad Jurisdiction." },
                                            { text: "Payments should be made within 7 days from the date of invoice,Internet @12% will be changed on all invoices after the due date.", margin: [0, 2, 0, 0] },
                                            { text: "We declare that this invoice shows the actual amount of products or services described and that all particulars are true and correct", margin: [0, 2, 0, 0] }
                                        ],
                                        fontSize: 5,
                                        margin: [20, 5, 0, 0]
                                    }
                                ]
                            }
                        ]
                    }











                ],

                footer: function (currentPage, pageCount) {
                    return [
                        {
                            stack: [
                                {
                                    columns: [
                                        {
                                            stack: [
                                                {
                                                    text: [
                                                        "For",
                                                        { text: " Kosmo Dental Clinic", color: "#87CEEB" }
                                                    ],
                                                    margin: [0, 1, 12, 0], // Adjusted bottom margin
                                                    alignment: "right",
                                                    fontSize: 8,
                                                    bold: true
                                                },
                                                {
                                                    text: "Authorized Signature",
                                                    margin: [0, 0, 15, 3], // Ensure it's within the view
                                                    alignment: "right",
                                                    fontSize: 8
                                                },
                                                {
                                                    text: `Page ${currentPage} of ${pageCount}`,
                                                    alignment: "right",
                                                    fontSize: 8,
                                                    margin: [0, 0, 15, 5] // Space before page number
                                                }

                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ];
                },






                styles: {
                    supplier: { fontSize: 12, margin: [0, 5, 0, 10] },
                    taxvoice: { fontSize: 8 },
                    tableHeader: {
                        bold: true,
                        fillColor: "#87CEEB",
                        alignment: "right",
                        fontSize: 8
                    },
                    tableText: {
                        alignment: "left",
                        fontSize: 8,
                        bold: true,
                        fillColor: "#87CEEB"
                    },
                    tableFirstBody: {
                        alignment: "right",
                        fontSize: 10
                    },
                    tableTextBody: {
                        alignment: "left",
                        fontSize: 10
                    },
                    tableBody: {
                        alignment: "center",
                        fontSize: 8
                    },
                    tableBank: {
                        fontSize: 12,
                        bold: true
                    },
                    tableSubHeader: {
                        fontSize: 9,
                        bold: true
                    },
                    bankDetailsText: {
                        alignment: "center",
                        margin: [0, 100, 0, 5]

                    },
                    invoiceStyle: {
                        fillColor: "#87CEEB",
                        color: "white",
                        fontSize: 8,
                        alignment: "right",
                        bold: true
                    },

                }
            };


            pdfMake.createPdf(docDefinition).getBlob((blob) => {
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            });
        });
    }







    return (
        <>
            <button onClick={createPdf} className="btn btn-primary mt-3">
                Generate PDF
            </button>
            {pdfurl && (
                <div>
                    <a href={pdfurl} target="_blank" rel="noopener noreferrer">
                        Open PDF
                    </a>
                </div>
            )}


        </>
    )
}

export default Invoice
