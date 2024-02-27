<?php namespace App\Models;

use CodeIgniter\Model;

class ReservasModel extends Model {
    protected $table = 'reservas';
    protected $primaryKey = 'id_reserva';
    protected $allowedFields = [
        'numPax',
        'fechaHoraReserva',
        'notasEspeciales',
        'estadoReserva',
        'id_cliente',
        'fechaCreacion',
        'id_empresa',
    ];
}