<?php

namespace App\Models;

use CodeIgniter\Model;

class TextoModel extends Model {
    protected $table = 'texto';
    protected $primaryKey = 'id_texto';
    protected $allowedFields = [
        'nomLocal',
        'texto',
        'id_user',
        'id_empresa',
    ];
}