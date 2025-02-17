import React, { useState } from 'react'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.addVirtualFileSystem(pdfFonts);


function DoctorsData({doctorDetails}) {
    console.log(doctorDetails)
    const{dutyDoctorId,slotFrom,token,branchId}=doctorDetails

    const slotFromProp = new Date(slotFrom); // Replace this with your actual date variable

const dayOptions = { weekday: 'long' }; // Get the full weekday name
const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }; // Format for date
const formattedDate = `${new Intl.DateTimeFormat('en-GB', dayOptions).format(slotFromProp)} ${slotFromProp.toLocaleDateString('en-GB', dateOptions)}`;


    const[pdfUrl,setPdfUrl]=useState(null)

    const createPdf=()=>{
     
        const docDefinition={
            pageSize:{width:226,height:"auto"},
            pageMargins:[5,5,5,5],

            content:[

                {text:branchId.name,alignment:"center"},
                {text:"OPD-A",style:"header",alignment:"center",margin:[0,2,0,0]},
                {
                    columns:[
                        {text:"Doctor:",width:"auto",margin:[0,0,0,0]},
                        {text:`${dutyDoctorId.firstName.charAt(0).toUpperCase()}${dutyDoctorId.firstName.slice(1)} ${dutyDoctorId.lastName}`,margin:[6,0,0,0]},

                        
                    ],
                    margin:[2,2,0,0]

                },

                {
                    columns:[
                        {text:"Date:",width:"auto",margin:[0,0,0,0]},
                        {text:formattedDate,margin:[15,0,0,0]}
                    ],
                    margin:[2,1,0,0]
                },
                {
                    columns:[
                        {text:"Time:",width:"auto",margin:[0,0,0,0]},
                        {text:`${new Date(slotFrom).toLocaleTimeString("en-Us",{hour: "2-digit", minute: "2-digit", hour12: true})}`,margin:[14,0,0,0]}
                        // {text:`Time:${new Date(slotFrom).toLocaleTimeString("en-Us",{ hour: "2-digit", minute: "2-digit", hour12: true })}`}
                    ],
                    margin:[2,1,0,0]
                },


                {
                    table: {
                        widths: ['25%', '50%', '25%'], // Adjust widths
                        body: [
                            ["*****", "TOKEN NUMBER", "*****"] // Keep everything in a single row
                        ]
                    },
                    layout: 'noBorders', // Removes table borders
                    alignment: "center",
                    margin: [0, 10, 0, 1]
                },
                {
                    canvas: [
                        { type: "line", x1: 0, y1: 0, x2: 220, y2: 0, lineWidth: 1 } // Horizontal line
                    ],
                    margin: [0, 1, 0, 10]
                },
                
                
                {
                    columns:[
                        {text:token,alignment:"center"}
                    ]
                },
                {
                    table:{
                        widths:["25%","50%","25%"],
                        body:
                        [
                            ["-----", "END", "-----"]
                        ]
                    },
                    layout:"noBorders",
                    alignment:"center",
                    margin:[0,10,0,10]
                }

            ]

        };

        pdfMake.createPdf(docDefinition).getBlob((blob)=>{
            const url=URL.createObjectURL(blob)
            setPdfUrl(url)
        })




    }
  return (
    <>

<button onClick={createPdf} className="btn btn-primary mt-3">
                Generate PDF
            </button>
            {pdfUrl && (
                <div>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                        Open PDF
                    </a>
                </div>
            )}

      
    </>
  )
}

export default DoctorsData
