<?php
/**
 * Template helpers.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Converts an "H:MM" time to minutes since midnight.
 *
 * @param string $time Time.
 * @return int
 */
function devhorizon_time_to_minutes( $time ) {
	if ( preg_match( '/^\s*(\d{1,2}):(\d{2})\s*$/', (string) $time, $matches ) ) {
		return ( (int) $matches[1] * 60 ) + (int) $matches[2];
	}

	return 0;
}

/**
 * Returns the URL of a theme image.
 *
 * @param string $file File name or relative path.
 * @return string
 */
function devhorizon_image_url( $file ) {
	return DEVHORIZON_URI . '/images/' . ltrim( $file, '/' );
}

/**
 * Returns a speaker's role and company.
 *
 * @param int  $speaker_id Speaker ID.
 * @param bool $spaced     Whether to use spaces around the at sign.
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
 * Returns a speaker's company.
 *
 * @param int $speaker_id Speaker ID.
 * @return string
 */
function devhorizon_speaker_company( $speaker_id ) {
	return trim( (string) get_post_meta( (int) $speaker_id, '_devhorizon_company', true ) );
}

/**
 * Returns the URL of a speaker's photo.
 *
 * @param int    $speaker_id Speaker ID.
 * @param string $size       Image size.
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
 * Returns the HTML for a speaker's photo.
 *
 * @param int    $speaker_id Speaker ID.
 * @param string $size       Image size.
 * @param string $class      Image CSS class.
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
 * Returns the first track of a session.
 *
 * @param int $session_id Session ID.
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
 * Returns the speaker ID for a session.
 *
 * @param int $session_id Session ID.
 * @return int
 */
function devhorizon_session_speaker_id( $session_id ) {
	return (int) get_post_meta( (int) $session_id, '_devhorizon_speaker_id', true );
}

/**
 * Returns the speaker name for a session.
 *
 * @param int $session_id Session ID.
 * @return string
 */
function devhorizon_session_speaker_name( $session_id ) {
	$speaker_id = devhorizon_session_speaker_id( $session_id );

	return $speaker_id ? get_the_title( $speaker_id ) : '';
}

/**
 * Returns the speaker company for a session.
 *
 * @param int $session_id Session ID.
 * @return string
 */
function devhorizon_session_company( $session_id ) {
	return devhorizon_speaker_company( devhorizon_session_speaker_id( $session_id ) );
}

/**
 * Returns the visible track name for a session.
 *
 * @param int $session_id Session ID.
 * @return string
 */
function devhorizon_session_track_name( $session_id ) {
	$track = devhorizon_session_track( $session_id );

	return $track ? $track->name : __( 'TALK', 'tech-conference-site' );
}

/**
 * Returns the track slug for a session.
 *
 * @param int $session_id Session ID.
 * @return string
 */
function devhorizon_session_track_slug( $session_id ) {
	$track = devhorizon_session_track( $session_id );

	return $track ? $track->slug : 'frontend';
}

/**
 * Determines whether a session has expandable content.
 *
 * @param int $session_id Session ID.
 * @return bool
 */
function devhorizon_session_has_details( $session_id ) {
	$description = trim( wp_strip_all_tags( (string) get_post_field( 'post_content', $session_id ) ) );
	$location    = trim( (string) get_post_meta( $session_id, '_devhorizon_location', true ) );

	return (bool) ( $description || $location );
}

/**
 * Returns the details block ID for a session.
 *
 * @param int $session_id Session ID.
 * @return string
 */
function devhorizon_session_details_id( $session_id ) {
	return 'session-details-' . (int) $session_id;
}

/**
 * Returns the date label for an event day.
 *
 * @param int $day Day 1, 2, or 3.
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
 * Returns the color class for a home highlight.
 *
 * @param string $track_slug Track slug.
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
 * Returns the short label for a track filter.
 *
 * @param string $slug Track slug.
 * @return string
 */
function devhorizon_track_filter_label( $slug ) {
	if ( 'accessibility' === $slug ) {
		return 'A11Y';
	}

	return strtoupper( (string) $slug );
}

/**
 * Returns the ticket barcode SVG.
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
 * Returns the modal data-* attributes for a speaker card.
 *
 * @param int $speaker_id Speaker ID.
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
