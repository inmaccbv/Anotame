<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class CORS extends BaseConfig
{
    public $allowedOrigins = ['http://localhost:8100'];
    public $allowedMethods = ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'];
    public $allowCredentials = true;
    public $maxAge = 86400; // 1 day
    public $exposedHeaders = [];
    public $allowedHeaders = [];
}
