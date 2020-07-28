const express = require('express');
const router = express.Router();

const pdfMake = require("../helpers/pdfmake");
const vfsFonts = require("../helpers/vfs_fonts");
const { isAuthenticated } = require("../helpers/auth");

const VisitaSaliente = require("../models/VisitaSaliente");

pdfMake.vfs = vfsFonts.pdfMake.vfs;

router.get("/reportes/crearReporte", isAuthenticated, (req, res) => {
    res.render('reportes/crear_reporte');
});

router.post('/reportes/crarReporte', (req, res, next) => {
    //res.send('PDF');

    const Visitas = VisitaSaliente.find()
    
    const lname = req.body.lname;

    var documentDefinition = {
        content: [
            { text: 'Tables', style: 'header' },
            'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
            { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
            'The following table has nothing more than a body array',
            {
                style: 'tableExample',
                table: {
                    body: Visitas
                }
            }
        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200,
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment;filename="filename.pdf"'
            });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });
});


module.exports = router;