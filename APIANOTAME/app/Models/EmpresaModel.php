<?php namespace App\Models;

use CodeIgniter\Model;

class EmpresaModel extends Model {
    protected $table = 'empresas';
    protected $primaryKey = 'id_empresa';
    protected $allowedFields = [
        'cif',
        'empresa',
        'direccion',
        'provincia',
        'ciudad',
        'cPostal',
        'tipoLocal'
    ];
}