<?php

          // require_once __DIR__ .'/../../../mpdf/vendor/autoload.php';
          // $pepe = __DIR__ .'/../../../mpdf/vendor/autoload.php';

          // $mpdf = new \Mpdf\Mpdf([

          // ]);

          // $mpdf->WriteHTML("hola mundo", \Mpdf\HTMLParserMode::HTML_BODY);
          // $mpdf->Output("pepe.pdf");
// error_reporting(0);

// if (! defined('BASEPATH')) exit('No direct script access allowed');

// if (! function_exists('getReferencias')) {
//     function getReferencias($items) {
//         $texto_referencias='';
//         for ($i=0; $i < sizeof($items); $i++) $texto_referencias.=  ( $i == (sizeof($items)-1) ) ? $items[$i] : $items[$i].' | ';
//         return $texto_referencias;
//     }
// }


if (! function_exists('generarReparacionPDF')) {
    function generarReparacionPDF($datos, $articulos, $datosusuario) {

      $resto_articulos = '';
      $id_usuario = '';
      $id_usuario = $datos['id_usuario'];
      $id_bono = $datos['id'];
      $page = 0;

      if ( is_array( $datos ) ) {
        if ( $page < count( $articulos ) ) // if the requested page doesn't exist
          $page = count( $articulos ); // give them the highest numbered page that DOES exist
      } else {
          $page = 0;
      }

      for ($i = 0; $i < $page; ++$i){
        $resto_articulos.='<tr class="limpieza ">';
        $resto_articulos.='<td class="limpieza muy_peque">&nbsp;-Fecha Ini: '.$articulos[$i]['fecha_ini'].'&nbsp; <strong>Fecha Fin:</strong> '.$articulos[$i]['fecha_fin'].'&nbsp; <strong>Tarea:</strong> '.$articulos[$i]['desc_ini'].'&nbsp; <strong>Descripción :</strong>'.$articulos[$i]['desc_fin'].'<hr></td>';
        $resto_articulos.='</tr>';
      }



/////////////////////////// A PARTIR DE AQUI NO SE PUEDE PONER PHP SOLO VARIABLES STRING //////////////////////////////////////////////////////

      require_once __DIR__ .'/../../../mpdf/vendor/autoload.php';

          $mpdf = new \Mpdf\Mpdf([
            'default_font' => 'arial',
            'shrink_tables_to_fit ' => 0
          ]);

        $mpdf->allow_charset_conversion=true;
        $mpdf->charset_in='UTF-8';
        $mpdf->useFixedNormalLineHeight = false;
        $mpdf->useFixedTextBaseline = false;
        $mpdf->adjustFontDescLineheight = 1.14;


        //$salto_de_pagina = 5; // ARTICULOS NECESARIOS A EXCEDER PARA SALTAR DE PAGINA

        // $cantidad_articulos = 0;

        $header = '
        <div class="header">
            <div class="limpieza fleft w80p">
                <br>
                <div class="limpieza titulo border ajustar_derecha">LISTADO INCIDENCIAS</div>
            </div>
            <div class="limpieza fright w20p">
                <img class="limpieza logo" src="../../mpdf/imgs/logo.jpg">
            </div>
        </div>
       ';


        $footer = '
        <div class="limpieza footer">
            <div class="limpieza border error w40p fleft">
                <div class="limpieza border fondo_gris ta_center peque"><b>Advanced Services JM2 S.L</b></div>
                <div class="limpieza border bug" style="margin: 0 auto; text-align: center;">
                    <img class="limpieza firma" src="">
                </div>
                <div class="limpieza border ta_center peque"></div>
            </div>
            <div class="limpieza border error w40p fright">
                <div class="limpieza border fondo_gris ta_center peque"><b>Advanced Services JM2 S.L</b></div>
                <div class="limpieza border bug" style="margin: 0 auto; text-align: center;">
                    <img class="limpieza firma" src="">
                </div>
                <div class="limpieza border ta_center peque"></div>
            </div>
        </div>
        ';

        // ESTE FOOTER ES PARA CUANDO HAY 2 ARTICULOS
        // YA QUE EL POSITION ABSOLUTE NO ACTUA COMO RELATIVO EN MPDF
        $footer2 = '
        <div class="limpieza footer2">
            <div class="limpieza ta_center" style="width: 100%;">

                <table class="limpieza tabla border">
                    <tr>
                        <td class="limpieza muy_peque fondo_gris" style="width: 200px">&nbsp;<b>Material entregado por:</b></td>
                        <td class="limpieza muy_peque" style="border-left: 1px solid black;">&nbsp;</td>
                    </tr>
                </table>
                <div style="height: 8px;"></div>
            </div>

            <div class="limpieza border w40p fleft error relative">

				<div class="limpieza border bug" style="margin: 0 auto; text-align: center;">
					<img class="limpieza firmacliente" src="">
				</div>
				<div class="limpieza border ta_center peque"><strong></strong> </div>
            </div>

            <div class="limpieza border error w40p fright">
                <div class="limpieza border fondo_gris ta_center peque"><b>Wehadent Ibérica, S.L.</b></div>
                <div class="limpieza border bug" style="margin: 0 auto; text-align: center;">
                    <img class="limpieza firma" src="">
                </div>
                <div class="limpieza border ta_center peque"></div>
            </div>


        </div>
        ';



        // // $cantidad_articulos = 2;

        // // SI HAY MAS DE UN ARTICULO EL CONTENT TIENE QUE MEDIR MENOS EN LA PRIMERA PAGINA (content2) SINO (content)
        // // PASA AL CONTRARIO CON EL FOOTER, TIENE QUE MEDIR MAS, (footer2) SINO (footer)
        // $content_size = "content2";
        // $footer_aux = $footer2;
        // if ($cantidad_articulos > $salto_de_pagina) {
        //     $content_size = "content";
        //     $footer_aux = $footer;
        // }

        // $pais = ''; //(   isset($datos_direccion['pais'])           ) ? strtoupper(    substr($datos_direccion['pais'],0,1)        ) . strtolower(     substr($datos_direccion['pais'],1)       ) : '';
        // $prov = ''; //(   isset($datos_direccion['provincia'])      ) ? strtoupper(    substr($datos_direccion['provincia'],0,1)   ) . strtolower(     substr($datos_direccion['provincia'],1)  ) : '';
        // $codp = ''; //(   isset($datos_direccion['codigo_postal'])  ) ? $datos_direccion['codigo_postal'] : '';
        // $pobl = ''; //(   isset($datos_direccion['poblacion'])      ) ? strtoupper(    substr($datos_direccion['poblacion'],0,1)   ) . strtolower(     substr($datos_direccion['poblacion'],1)  ) : '';

        // // HTML DE LA PAGINA 1

        $html = '
            <style>
                .logo {
                    width: 90%;
                    float: right;
                }
                .firma {
                    margin: 0 auto;
                    width: 83%;
                }
				.firmacliente {
                    margin: 0 auto;
                    width: 58%;
                }
                .limpieza {
                    margin: 0;
                    padding: 0;
                }
                .relleno_bug {
                    height: 20px;
                }
                .peque {
                    font-size: 0.8rem;
                }
                .muy_peque {
                    font-size: 0.7rem;
                }
                .super_peque {
                    font-size: 0.6rem;
                }
                .mt {
                    margin-top: 10px;
                }
                .header {
                    top: 0;
                    height: 10%;
                    position: relative;
                }
                .content {
                    width: 100%;
                    height: 76%;
                    position: relative;
                }
                .content2 {
                    height: 61.5%;
                }
                .footer {
                    bottom: 0;
                    height: 13%;
                    position: relative;
                }
                .footer2 {
                    height: 27.5%;
                }
                .pagina {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                .titulo {
                    font-size: 1.65rem;
                }
                .subtitulo {
                    font-size: 2rem;
                }
                .subtitulo2 {
                    font-size: 1.3rem;
                }
                .tabla {
                    width: 100%;
                }
                .espacio {
                    width: 1px;
                    height: 6px;
                }
                .fleft {
                    float: left;
                }
                .fright {
                    float: right;
                }
                .w80p {
                    width: 79%;
                }
                .w45p {
                    width: 45%;
                }
                .w40p {
                    width: 40%;
                }
				        .w35p {
                    width: 30%;
                }
                .w20p {
                    width: 20%;
                }
                .h10 {
                    height: 10px;
                }
                .w21 {
                    width: 21px;
                }
                .w5 {
                    width: 5px;
                }
                .w55 {
                    width: 55px;
                }
                .w135 {
                    width: 135px;
                }
                .w150 {
                    width: 170px;
                }
                .border {
                    border: 1px solid black;
                }
                .ajustar_derecha {
                    text-align: center;
                    width: 73%;
                    float: right;
                }
                .bug {
                    height: 9.5%;
                }
                .relative {
                    position: relative;
                }
                .error {
                    height: 13%;
                    padding: 10px;
                }
                .ajuste_arr_izq {
                    position:absolute;
                    left: 5px;
                    top: 5px;
                    margin-top: 5px:
                    margin-left: 5px;
                }
                .fondo_gris {
                    background-color: lightgray;
                }
                .ta_center {
                    text-align:center;
                }
                .ta_left {
                    text-align: left;
                }
                .ta_right {
                    text-align: right;
                }
                .mitad {
                    width: 49%;
                }

                table {
                    border-collapse: collapse;
                }
            </style>

            <div class="pagina">
                '.$header.'
                <div class="limpieza">
                    <br>
                    <div class="mitad fleft">
                        <table class="border tabla">
                            <tr><td class="limpieza fondo_gris peque border"><b>&nbsp;CLIENTE</b></td></tr>
                            <tr><td class="limpieza peque">&nbsp;'.json_encode($datosusuario['0']['empresa_cliente']).'</td></tr>
                            <tr><td class="limpieza peque">&nbsp;'.json_encode($datosusuario['0']['dni']).'</td></tr>'.
                            "<tr><td class='limpieza peque'>&nbsp;'".json_encode($datosusuario['0']['direccion'])."'</td></tr>
                            <tr><td class='limpieza peque'>&nbsp;'".json_encode($datosusuario['0']['cp'])."'</td></tr>".
                            '<tr><td class="limpieza peque">&nbsp;'.json_encode($datosusuario['0']['telefono']).'</td></tr>
                            <tr><td class="limpieza peque">&nbsp;'.json_encode($datosusuario['0']['email']).'</td></tr>
                        </table>
                    </div>
                    <div class="mitad fright">
                        <table class="border tabla">
                            <tr><td class="limpieza peque" colspan="5"><b>&nbsp;JM2INFORMATICA</b></td></tr>
                            <tr><td class="limpieza peque" colspan="5">&nbsp;CL DOCTOR MONSERRAT 18 BAJO</td></tr>
                            <tr><td class="limpieza peque" colspan="5">&nbsp;46008 VALENCIA</td></tr>
                            <tr>
                                <td class="limpieza peque" colspan="3">&nbsp;VALENCIA/VALÉNCIA</td>
                                <td class="limpieza peque" colspan="2">&nbsp;&nbsp;ESPAÑA</td>
                            </tr>
                            <tr>
                                <td class="limpieza peque" colspan="2">&nbsp;CIF.:</td>
                                <td class="limpieza peque" colspan="3">B97984645</td>
                            </tr>
                            <tr>
                                <td class="limpieza peque" colspan="2">&nbsp;Teléfono:</td>
                                <td class="limpieza peque" >963524141</td>
                            </tr>
                            <tr>
                                <td class="limpieza peque w21">&nbsp;eMail:</td>
                                <td class="limpieza peque w21"></td>
                                <td class="limpieza peque w55">oficinas.es@wh.com</td>

                            </tr>
                        </table>
                    </div>
                    <br>
                    <div class="fleft" style="width:32%" >
                        <table class="border tabla">
                            <tr><td colspan="2" class="limpieza fondo_gris peque border"><b>&nbsp;Número Bono</b></td></tr>
                            <tr>
                                <td class="limpieza peque">&nbsp;&nbsp;'.json_encode($datos['id_bono']).'</td>
                                <td class="limpieza peque">'.json_encode($datos['nombrebono']).'</td>
                            </tr>
                        </table>
                    </div>
                    <div class="fleft" style="width: 33%; margin-left: 1.5%">
                        <table class="border tabla">
                            <tr><td class="limpieza fondo_gris peque border ta_center"><b>Fecha Inicio Bono</b></td></tr>
                            <tr>
                                <td class="limpieza peque ta_center">'.json_encode($datos['fecha_ini']).'</td>
                            </tr>


                        </table>
                    </div>

                    <br>

					<div class="limpieza">

					</div>

                    <br>
                    <br>


                    <div class="limpieza super_peque" style="padding-left: 5px; border-top: 1px solid black; border-left: 1px solid black; border-right: 1px solid black;">
                        *  Es un contrato informático tipo bono de 8, 12, 24 ó 36 horas.
                    </div>
                    <div style="border-left: 1px solid black; border-right: 1px solid black; height: 5px"></div>
                    <div class="limpieza super_peque" style="padding-left: 5px; border-left: 1px solid black; border-right: 1px solid black;">
                        - Utilizables como el cliente considere oportuno para cualquier equipo.
                    </div>
                    <div style="border-left: 1px solid black; border-right: 1px solid black; height: 5px"></div>
                    <div class="limpieza super_peque" style="padding-left: 5px; border-left: 1px solid black; border-right: 1px solid black;">
                        - Asistencia in situ o remota según las necesidades, primando siempre la calidad del servicio y la rapidez de resolución.
                    </div>
                    <div style="border-left: 1px solid black; border-right: 1px solid black; height: 5px"></div>
                     <div class="limpieza super_peque" style="padding-left: 5px; border-left: 1px solid black; border-right: 1px solid black;">
                        - En asistencias On Line remotas, se cuentan en fracciones de 1/2 hora.
                    </div>
                    <div style="border-left: 1px solid black; border-right: 1px solid black; height: 5px"></div>
                    <div class="limpieza super_peque" style="padding-left: 5px; border-bottom: 1px solid black; border-left: 1px solid black; border-right: 1px solid black;">
                        - El tiempo de respuesta por contrato es de 8 horas laborales, de lunes a viernes.
                    </div>


                    <br>

                    <div class="limpieza">
                        Incidencias Relacionadas
					          </div>

                    <br>

                    <div class="limpieza">
                        <table class="limpieza tabla">

                                '.$resto_articulos.'

                        </table>
                    </div>
                </div>

            </div>

        ';
         $html = mb_convert_encoding($html, 'UTF-8', 'UTF-8');
        // $mpdf->WriteHTML($html);


        // // HTML DE LA PAGINA 2

        // if ($cantidad_articulos > $salto_de_pagina) {

        //     $mpdf->AddPage();
        //     $html = '
        //         <div class="limpieza " style="height: 71.5%; width: 100%">
        //             <table class="limpieza tabla">
        //                 <tr class="limpieza border fondo_gris">
				// 		<td class="limpieza muy_peque" style="border-right: 1px solid black;">&nbsp;Referencia&nbsp;</td>
				// 		<td class="limpieza muy_peque" style="border-right: 1px solid black; width: 350px">&nbsp;Descripcion Pedido</td>
				// 		<td class="limpieza muy_peque" style="border-right: 1px solid black">&nbsp;&nbsp;Cantidad&nbsp;</td>
				// 		<td class="limpieza muy_peque" style="border-right: 1px solid black; text-align:center">&nbsp;Nº de Serie&nbsp;</td>

        //                 </tr>
        //                 '.
        //                     $resto_articulos
        //                 .'
        //             </table>
        //         </div>
        //     '.$footer2.'
        //     ';
        //     $mpdf->WriteHTML($html);

        // }

        // // ASIGNAR DIRECTORIO
          $dir ='../../USUARIOS/'.$id_usuario.'/'.'PDF/listadoincidencias'.$id_bono.'.pdf';
         //$dir1 = '../../USUARIOS/pepe.pdf';
        // // // CREAR CARPETA EN CASO DE NO EXISTIR
        // // if ( !file_exists( $dir ) && !is_dir( $dir ) ) mkdir($dir, 0755, true);

        // // // BORRAR ARCHIVO PDF PARA VOLVER A GENERARLO
        // // if ($editar) unlink($dir.$file_name);

        // // GENERAR PDF
        // //$mpdf->Output($dir1.$file_name , 'F');


        $mpdf->WriteHTML($html);
          $mpdf->Output($dir);


    }
}
