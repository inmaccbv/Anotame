<?php namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Routing\RouterInterface;

class App extends BaseConfig implements \Config\App
{
    public $baseURL = 'http://localhost/anotame/APIANOTAME/public/';
    public $indexPage = '';

    // ...
}

$routes = Services::routes();

if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

$routes->post('Registro', 'Registro::index'); // Ruta para la acción de registro

// Otras rutas pueden agregarse según sea necesario

// Rutas adicionales basadas en el entorno
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
