const express = require('express');
const router = express.Router();

const pdfMake = require("../helpers/pdfmake");
const vfsFonts = require("../helpers/vfs_fonts");
const { isAuthenticated } = require("../helpers/auth");

const VisitaSaliente = require("../models/VisitaSaliente");
const { text } = require('express');

pdfMake.vfs = vfsFonts.pdfMake.vfs;

router.get("/reportes/crearReporte", isAuthenticated, (req, res) => {
    res.render('reportes/crear_reporte');
});

router.post('/reportes/crarReporte', async (req, res, next) => {
    //res.send('PDF');



    /* const Visitas = VisitaSaliente.find({}, function (err, data) {
         console.log('Errors: '+ err, 'Data length: ' + data.length);
         const reportes = data;
         //console.log('Reportes : ', reportes);
         return reportes; 
     });
     console.log('Reportes ',Visitas); 
         {text:'Cedula'},
         {text:'Telefono'},
         {text:'Email'},
         {text:'Genero'},
         {text:'Lugar de Visita'},
         {text:'Hora entrada'},
         {text:'Hora salida'},*/

    const Visitas = VisitaSaliente.find();
    const reportes = [];
    for await (const doc of Visitas) {
        reportes.push(doc);
    }
    
    console.log('reportesArray: ', reportes.length);
    
    const pdfdata =[]; 
    pdfdata.push([
        {text:'Nombres'},
        {text:'Cedula'},
        {text:'Telefono'},
    ]);

    for(i = 0; i < reportes.length; i++) {
        console.log('registro ', i);
        pdfdata.push([
            {text: reportes[i].nombres},
            {text: reportes[i].cedula},
            {text: reportes[i].telefono}
        ]);
        console.log('fila: '+ i , pdfdata);
    }
    console.log(pdfdata.length); 




    //pdfdata.push([{text: reportes[0].nota}],[{text:reportes[4].nota}]); 
    // console.log(pdfdata[2]);


    /*
    const pdfdata =[]; 
    
          pdfdata.push([
            {text:'Nombres'},
            {text:'Cedula'},
            {text:'Telefono'},
            {text:'Email'},
            {text:'Genero'},
            {text:'Temperatura'},
            {text:'Lugar de Visita'},
            {text:'Hora entrada'},
            {text:'Hora salida'}
          ]);
           */
         var documentDefinition = {
              content: [
                  { text: 'Tables', style: 'header' },
                  'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
                  { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
                  'The following table has nothing more than a body array',
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
                      'Content-Disposition': 'attachment;filename="filename.pdf"'
                  });
      
              const download = Buffer.from(data.toString('utf-8'), 'base64');
              res.end(download);
          });
});


module.exports = router;