<?php namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Config\Services;
use CodeIgniter\API\ResponseTrait;
use App\Libraries\CiOAuth;
use OAuth2\Request;

class GuardFilter implements FilterInterface
{
	use ResponseTrait;

	public function before(RequestInterface $request, $arguments = null)
    {
        // Do something here
		$ci_oauth = new CiOAuth();
		$oauth_request = Request::createFromGlobals();
		//VALIDAR SI EL TOKEN ES VALIDO
		if (!$ci_oauth->server->verifyResourceRequest($oauth_request)) {
			$ci_oauth->server->getResponse()->send();
			exit();
		}
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do something here
    }
}
