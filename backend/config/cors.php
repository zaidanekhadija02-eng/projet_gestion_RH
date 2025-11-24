<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Paths
    |--------------------------------------------------------------------------
    |
    | Les chemins pour lesquels le CORS est appliqué. Ici, toutes les routes
    | de l’API (prefixées par /api) seront accessibles depuis React.
    |
    */
    'paths' => ['api/*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Méthodes HTTP autorisées. '*' autorise toutes les méthodes.
    |
    */
    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Origines autorisées. Ici, ton frontend React tourne sur localhost:3000
    |
    */
    'allowed_origins' => ['http://localhost:3000'],


    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Les headers autorisés dans la requête. '*' accepte tous les headers.
    |
    */
    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Les headers que le client peut lire depuis la réponse.
    |
    */
    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | Durée (en secondes) pendant laquelle le résultat d’une requête prévol CORS
    | peut être mis en cache par le navigateur.
    |
    */
    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Indique si les cookies et informations d’authentification peuvent être
    | envoyés avec la requête.
    |
    */
    'supports_credentials' => false,

];
