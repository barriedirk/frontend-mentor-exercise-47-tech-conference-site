<?php
/**
 * Plugin Name: Mailpit (solo desarrollo)
 * Description: Envía todo el correo de WordPress al SMTP de Mailpit.
 * Version:     1.1
 *
 * No envía nada a Internet: Mailpit captura el mensaje y lo muestra en
 * http://localhost:8025. Para desactivarlo, renombra este archivo.
 */

/**
 * WordPress genera "wordpress@localhost" cuando la web se abre como
 * localhost. PHPMailer considera "localhost" un dominio inválido y lanza
 * "Invalid address: (From)" ANTES de ejecutar phpmailer_init, así que
 * wp_mail() devuelve false sin llegar a conectar con Mailpit.
 * Corregimos el remitente aquí, antes de esa validación.
 */
add_filter( 'wp_mail_from', function ( $from ) {
	if ( ! $from || 'wordpress@localhost' === $from || ! is_email( $from ) ) {
		return 'wordpress@example.test';
	}

	return $from;
} );

add_filter( 'wp_mail_from_name', function ( $name ) {
	return $name ? $name : 'WordPress (local)';
} );

add_action( 'phpmailer_init', function ( $phpmailer ) {
	$phpmailer->isSMTP();
	$phpmailer->Host        = 'mailpit'; // nombre del servicio en Compose
	$phpmailer->Port        = 1025;      // puerto SMTP interno de Mailpit
	$phpmailer->SMTPAuth    = false;
	$phpmailer->SMTPSecure  = '';
	$phpmailer->SMTPAutoTLS = false;
	$phpmailer->Timeout     = 10;
} );
