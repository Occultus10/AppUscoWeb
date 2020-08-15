const express = require('express');
const router = express.Router();
const moment = require('moment');

const pdfMake = require("../helpers/pdfmake");
const vfsFonts = require("../helpers/vfs_fonts");
const { isAuthenticated } = require("../helpers/auth");
const { adminAuth } = require("../helpers/userAdmin")

const VisitaSaliente = require("../models/VisitaSaliente");


pdfMake.vfs = vfsFonts.pdfMake.vfs;

router.get("/reportes/crearReporte", adminAuth,isAuthenticated,  (req, res) => {
    res.render('reportes/crear_reporte');

});
router.post('/reportes/crearReporte', async (req, res, next) => {
    //res.send('PDF');

    /* const Visitas = VisitaSaliente.find({}, function (err, data) {
         console.log('Errors: '+ err, 'Data length: ' + data.length);
         const reportes = data;
         //console.log('Reportes : ', reportes);
         return reportes; 
     });*/
    

    const Visitas = VisitaSaliente.find();
    const reportes = [];
    for await (const doc of Visitas) {
        reportes.push(doc);
    }

    

    const pdfdata = [];
    pdfdata.push([
        { text: 'Nombres' },
        { text: 'Cedula' },
        { text: 'Telefono' },
        { text: 'Direccion' },
        { text: 'Lugar de Visita' },
        { text: 'Hora entrada' },
        { text: 'Hora salida' }

    ]);

    for (i = 0; i < reportes.length; i++) {
    
        pdfdata.push([
            { text: reportes[i].nombres },
            { text: reportes[i].cedula },
            { text: reportes[i].telefono },
            { text: reportes[i].direccion },
            { text: reportes[i].lugarVisita },
            { text: String(reportes[i].dateEntrada) },
            { text: String(reportes[i].dateSalida) },
        ]);
        

    }
    





    //pdfdata.push([{text: reportes[0].nota}],[{text:reportes[4].nota}]); 
    // console.log(pdfdata[2]);

    var documentDefinition = {
        content: [
            { text: 'REPORTE UNIVERSIDAD SURCOLOMBIANA', style: 'header ' },


            { text: 'La siguiente tabla contiene el ingreso y salida de las personas a la universidad Surcolombiana.', style: 'subheader' },

            {
                style: 'tableExample',
                table: {
                    body: pdfdata
                }
            }
        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200,
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment;filename="Reporte_general.pdf"'
            });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });
});


router.post("/reportes/buscadorVisitasReporte", async (req, res) =>{

    const Visitante = await VisitaSaliente.find({cedula : req.body.cedula}).sort({ date: "desc" }).lean();

    //res.render('reportes/crear_reporte',{Visitante});

    const reportes = [];
    for await (const doc of Visitante) {
        reportes.push(doc);
    }

    

    const pdfdata = [];
    pdfdata.push([
        { text: 'Nombres' },
        { text: 'Cedula' },
        { text: 'Telefono' },
        { text: 'Direccion' },
        { text: 'Lugar de Visita' },
        { text: 'Hora entrada' },
        { text: 'Hora salida' }

    ]);

    for (i = 0; i < reportes.length; i++) {
    
        pdfdata.push([
            { text: reportes[i].nombres },
            { text: reportes[i].cedula },
            { text: reportes[i].telefono },
            { text: reportes[i].direccion },
            { text: reportes[i].lugarVisita },
            { text: String(reportes[i].dateEntrada) },
            { text: String(reportes[i].dateSalida) },
        ]);
       // console.log('fila: ' + i, pdfdata);
    }

   //pdfdata.push([{text: reportes[0].nota}],[{text:reportes[4].nota}]); 
    // console.log(pdfdata[2]);

    var documentDefinition = {
        content: [
            { text: 'REPORTE UNIVERSIDAD SURCOLOMBIANA', style: 'header ' },
            { text: 'La siguiente tabla contiene el ingreso y salida de las personas a la universidad Surcolombiana.', style: 'subheader' },

            {
                style: 'tableExample',
                table: {
                    body: pdfdata
                }
            }
        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200,
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment;filename="Reporte_por_cedula.pdf"'
            });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });

    //const NewrReporteRealizado = new ReporteRealizado ({registroVisita: "Reporte con fecha 15/0820", fechaImpresion :moment().format()}); 
    //console.log(NewrReporteRealizado); 


});

router.post("/reportes/filtroFechas" ,async (req,res)=>{

    const Visitas = await VisitaSaliente.find({ dateEntrada: {$lt: req.body.fechaFin, $gt: req.body.fechaInicio}}).sort({ date: "desc" }).lean();
    
    const reportes = [];
    for await (const doc of Visitas) {
        reportes.push(doc);
    }

    
    const pdfdata = [];
    pdfdata.push([
        { text: 'Nombres' },
        { text: 'Cedula' },
        { text: 'Telefono' },
        { text: 'Direccion' },
        { text: 'Lugar de Visita' },
        { text: 'Hora entrada' },
        { text: 'Hora salida' }

    ]);
    for (i = 0; i < reportes.length; i++) {
        pdfdata.push([
            { text: reportes[i].nombres },
            { text: reportes[i].cedula },
            { text: reportes[i].telefono },
            { text: reportes[i].direccion },
            { text: reportes[i].lugarVisita },
            { text: String(reportes[i].dateEntrada) },
            { text: String(reportes[i].dateSalida) },
        ]);
       // console.log('fila: ' + i, pdfdata);
    }
    documentDefinition = {
        content: [
            { text: 'REPORTE UNIVERSIDAD SURCOLOMBIANA', style: 'header ' },
            { text: 'La siguiente tabla contiene el ingreso y salida de las personas a la universidad Surcolombiana.', style: 'subheader' },            {
                style: 'tableExample',
                table: {
                    body: pdfdata
                }
            }
        ]
    };
    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200,
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment;filename="Reporte_por_fechas.pdf"'
            });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });

});




module.exports = router;