<?php

namespace App\Models;

use CodeIgniter\Model;

class ReviewsModel extends Model {
    protected $table = 'reviews';
    protected $primaryKey = 'id_reviews';
    protected $allowedFields = [
        'calificacion',
        'comentario',
        'id_cliente',
        'id_empresa',
        'respuesta'
    ];
}