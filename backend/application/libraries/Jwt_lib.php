<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Jwt_lib {

    protected $secret = 'kmap_secret_jwt_key_2026_super_secure';
    protected $expire = 86400;

    public function __construct($params = []) {
        if (isset($params['secret'])) $this->secret = $params['secret'];
        if (isset($params['expire'])) $this->expire = $params['expire'];
    }

    public function sign($payload) {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $payload['iat'] = time();
        $payload['exp'] = time() + $this->expire;

        $base64UrlHeader = $this->base64UrlEncode(json_encode($header));
        $base64UrlPayload = $this->base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public function verify($jwt) {
        if (!$jwt) return null;
        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) !== 3) return null;

        list($header64, $payload64, $sig64) = $tokenParts;
        $sig = $this->base64UrlDecode($sig64);
        $expectedSig = hash_hmac('sha256', $header64 . "." . $payload64, $this->secret, true);

        if (!hash_equals($sig, $expectedSig)) {
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($payload64), true);
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    protected function base64UrlEncode($text) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
    }

    protected function base64UrlDecode($text) {
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $text));
    }
}
