<?php namespace App\Models;

use CodeIgniter\Model;

class ProvinciasModel extends Model {
    protected $table = 'provincias';
    protected $primaryKey = 'id_provincia';
    protected $allowedFields = [
        'id_provincia',
        'provincia'
    ];
}