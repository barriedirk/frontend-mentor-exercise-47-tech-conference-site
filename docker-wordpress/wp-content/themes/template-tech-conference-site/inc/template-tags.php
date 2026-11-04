<?php
/**
 * Helpers de plantilla.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Convierte una hora "H:MM" a minutos desde medianoche.
 *
 * @param string $time Hora.
 * @return int
 */
function devhorizon_time_to_minutes( $time ) {
	if ( preg_match( '/^\s*(\d{1,2}):(\d{2})\s*$/', (string) $time, $matches ) ) {
		return ( (int) $matches[1] * 60 ) + (int) $matches[2];
	}

	return 0;
}

/**
 * Devuelve la URL de una imagen del tema.
 *
 * @param string $file Nombre o ruta relativa del archivo.
 * @return string
 */
function devhorizon_image_url( $file ) {
	return DEVHORIZON_URI . '/images/' . ltrim( $file, '/' );
}

/**
 * Devuelve el rol y la empresa de un speaker.
 *
 * @param int  $speaker_id ID del speaker.
 * @param bool $spaced     Usar espacios alrededor de la arroba.
 * @return string
 */
function devhorizon_speaker_affiliation( $speaker_id, $spaced = false ) {
	$speaker_id = (int) $speaker_id;
	$role       = trim( (string) get_post_meta( $speaker_id, '_devhorizon_role', true ) );
	$company    = trim( (string) get_post_meta( $speaker_id, '_devhorizon_company', true ) );

	if ( $role && $company ) {
		return $role . ( $spaced ? ' @ ' : ' @' ) . $company;
	}

	return $role ? $role : $company;
}

/**
 * Devuelve la empresa de un speaker.
 *
 * @param int $speaker_id ID del speaker.
 * @return string
 */
function devhorizon_speaker_company( $speaker_id ) {
	return trim( (string) get_post_meta( (int) $speaker_id, '_devhorizon_company', true ) );
}

/**
 * Devuelve la URL de la foto de un speaker.
 *
 * @param int    $speaker_id ID del speaker.
 * @param string $size       Tamaño de imagen.
 * @return string
 */
function devhorizon_speaker_photo_url( $speaker_id, $size = 'devhorizon-avatar' ) {
	$speaker_id = (int) $speaker_id;
	$url        = get_the_post_thumbnail_url( $speaker_id, $size );

	if ( $url ) {
		return $url;
	}

	return devhorizon_image_url( 'pattern-avatar-bg.svg' );
}

/**
 * Devuelve el HTML de la foto de un speaker.
 *
 * @param int    $speaker_id ID del speaker.
 * @param string $size       Tamaño de imagen.
 * @param string $class      Clase CSS de la imagen.
 * @return string
 */
function devhorizon_speaker_photo_html( $speaker_id, $size = 'devhorizon-speaker', $class = 'speaker-card-img' ) {
	$speaker_id = (int) $speaker_id;
	$alt        = get_the_title( $speaker_id );
	$class      = sanitize_html_class( $class );

	if ( has_post_thumbnail( $speaker_id ) ) {
		return get_the_post_thumbnail(
			$speaker_id,
			$size,
			array(
				'class'   => $class,
				'loading' => 'lazy',
				'alt'     => $alt,
			)
		);
	}

	return sprintf(
		'<img src="%1$s" alt="%2$s" class="%3$s" loading="lazy" />',
		esc_url( devhorizon_speaker_photo_url( $speaker_id, $size ) ),
		esc_attr( $alt ),
		esc_attr( $class )
	);
}

/**
 * Devuelve el primer track de una sesión.
 *
 * @param int $session_id ID de la sesión.
 * @return WP_Term|null
 */
function devhorizon_session_track( $session_id ) {
	$terms = get_the_terms( (int) $session_id, 'devhorizon_track' );

	if ( ! $terms || is_wp_error( $terms ) ) {
		return null;
	}

	return $terms[0];
}

/**
 * Devuelve el ID del speaker de una sesión.
 *
 * @param int $session_id ID de la sesión.
 * @return int
 */
function devhorizon_session_speaker_id( $session_id ) {
	return (int) get_post_meta( (int) $session_id, '_devhorizon_speaker_id', true );
}

/**
 * Devuelve el nombre del speaker de una sesión.
 *
 * @param int $session_id ID de la sesión.
 * @return string
 */
function devhorizon_session_speaker_name( $session_id ) {
	$speaker_id = devhorizon_session_speaker_id( $session_id );

	return $speaker_id ? get_the_title( $speaker_id ) : '';
}

/**
 * Devuelve la empresa del speaker de una sesión.
 *
 * @param int $session_id ID de la sesión.
 * @return string
 */
function devhorizon_session_company( $session_id ) {
	return devhorizon_speaker_company( devhorizon_session_speaker_id( $session_id ) );
}

/**
 * Devuelve el nombre visible del track de una sesión.
 *
 * @param int $session_id ID de la sesión.
 * @return string
 */
function devhorizon_session_track_name( $session_id ) {
	$track = devhorizon_session_track( $session_id );

	return $track ? $track->name : __( 'TALK', 'tech-conference-site' );
}

/**
 * Devuelve el slug del track de una sesión.
 *
 * @param int $session_id ID de la sesión.
 * @return string
 */
function devhorizon_session_track_slug( $session_id ) {
	$track = devhorizon_session_track( $session_id );

	return $track ? $track->slug : 'frontend';
}

/**
 * Indica si una sesión tiene contenido desplegable.
 *
 * @param int $session_id ID de la sesión.
 * @return bool
 */
function devhorizon_session_has_details( $session_id ) {
	$description = trim( wp_strip_all_tags( (string) get_post_field( 'post_content', $session_id ) ) );
	$location    = trim( (string) get_post_meta( $session_id, '_devhorizon_location', true ) );

	return (bool) ( $description || $location );
}

/**
 * Devuelve el ID del bloque de detalles de una sesión.
 *
 * @param int $session_id ID de la sesión.
 * @return string
 */
function devhorizon_session_details_id( $session_id ) {
	return 'session-details-' . (int) $session_id;
}

/**
 * Devuelve la etiqueta de fecha de un día del evento.
 *
 * @param int $day Día 1, 2 o 3.
 * @return string
 */
function devhorizon_event_date_label( $day ) {
	$dates = array(
		1 => 'NOV 15',
		2 => 'NOV 16',
		3 => 'NOV 17',
	);

	return isset( $dates[ (int) $day ] ) ? $dates[ (int) $day ] : 'NOV 15';
}

/**
 * Devuelve la clase de color de un highlight de home.
 *
 * @param string $track_slug Slug del track.
 * @return string
 */
function devhorizon_highlight_class( $track_slug ) {
	$map = array(
		'performance'   => 'ticket-rose',
		'frontend'      => 'ticket-yellow',
		'accessibility' => 'ticket-blue',
		'tooling'       => 'ticket-lavender',
		'keynote'       => 'ticket-blue',
	);

	return isset( $map[ $track_slug ] ) ? $map[ $track_slug ] : 'ticket-yellow';
}

/**
 * Devuelve la etiqueta corta de un filtro de track.
 *
 * @param string $slug Slug del track.
 * @return string
 */
function devhorizon_track_filter_label( $slug ) {
	if ( 'accessibility' === $slug ) {
		return 'A11Y';
	}

	return strtoupper( (string) $slug );
}

/**
 * Devuelve el SVG del código de barras de los tickets.
 *
 * @return string
 */
function devhorizon_barcode_svg() {
	return '<svg class="barcode-svg" viewBox="0 0 55 32" fill="currentColor" aria-hidden="true" focusable="false">
		<rect x="0" y="0" width="3" height="32" />
		<rect x="5" y="0" width="1.5" height="32" />
		<rect x="8" y="0" width="4" height="32" />
		<rect x="14" y="0" width="2" height="32" />
		<rect x="17.5" y="0" width="1.5" height="32" />
		<rect x="21.5" y="0" width="3.5" height="32" />
		<rect x="26.5" y="0" width="2" height="32" />
		<rect x="30.5" y="0" width="4.5" height="32" />
		<rect x="36.5" y="0" width="1.5" height="32" />
		<rect x="40" y="0" width="3" height="32" />
		<rect x="44.5" y="0" width="2" height="32" />
		<rect x="48" y="0" width="4" height="32" />
		<rect x="53.5" y="0" width="2" height="32" />
	</svg>';
}

/**
 * Devuelve los atributos data-* del modal para una tarjeta de speaker.
 *
 * @param int $speaker_id ID del speaker.
 * @return string
 */
function devhorizon_speaker_modal_attrs( $speaker_id ) {
	$speaker_id = (int) $speaker_id;
	$session    = devhorizon_get_speaker_session( $speaker_id );
	$track      = $session ? devhorizon_session_track( $session->ID ) : null;
	$bio        = trim( wp_strip_all_tags( (string) get_post_field( 'post_content', $speaker_id ) ) );

	$attrs = array(
		'data-speaker-id'         => $speaker_id,
		'data-speaker-name'       => get_the_title( $speaker_id ),
		'data-speaker-role'       => devhorizon_speaker_affiliation( $speaker_id, true ),
		'data-speaker-company'    => devhorizon_speaker_company( $speaker_id ),
		'data-speaker-bio'        => $bio,
		'data-speaker-photo'      => devhorizon_speaker_photo_url( $speaker_id, 'devhorizon-avatar' ),
		'data-talk-title'         => $session ? get_the_title( $session->ID ) : '',
		'data-talk-track'         => $track ? $track->name : '',
		'data-talk-time-start'    => $session ? (string) get_post_meta( $session->ID, '_devhorizon_start_time', true ) : '',
		'data-talk-time-end'      => $session ? (string) get_post_meta( $session->ID, '_devhorizon_end_time', true ) : '',
		'data-talk-location'      => $session ? (string) get_post_meta( $session->ID, '_devhorizon_location', true ) : '',
		'data-session-id'         => $session ? $session->ID : '',
	);

	$output = ' data-modal-open="1"';

	foreach ( $attrs as $name => $value ) {
		$output .= sprintf( ' %s="%s"', $name, esc_attr( $value ) );
	}

	return $output;
}
