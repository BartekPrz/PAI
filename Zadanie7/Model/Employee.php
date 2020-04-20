<?php
App::uses('AppModel', 'Model');
/**
 * Employee Model
 *
 */
class Employee extends AppModel {
    var $validate = array('nazwisko' => array('rule' => 'notBlank'), 'etat' => array('rule' => 'notBlank'),
                            'placa_pod' => array('firstRule' => array('rule' => array('comparison', '>=', 0), 'message' => 'Placa podstawowa musi byc wieksza lub rowna 0'),
                                           'secondRule' => array('rule' => array('comparison', '<=', 2000), 'message' => 'Placa podstawowa musi byc mniejsza lub rowna 2000')));
}
