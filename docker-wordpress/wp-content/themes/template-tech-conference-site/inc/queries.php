<?php
/**
 * Consultas reutilizables.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Devuelve todos los speakers publicados.
 *
 * @return WP_Query
 */
function devhorizon_get_all_speakers() {
	return new WP_Query(
		array(
			'post_type'           => 'devhorizon_speaker',
			'post_status'         => 'publish',
			'posts_per_page'      => -1,
			'orderby'             => array(
				'menu_order' => 'ASC',
				'title'      => 'ASC',
			),
			'no_found_rows'       => true,
			'ignore_sticky_posts' => true,
		)
	);
}

/**
 * Devuelve los speakers destacados de la home.
 *
 * @param int $limit Número máximo.
 * @return WP_Query
 */
function devhorizon_get_featured_speakers( $limit = 8 ) {
	return new WP_Query(
		array(
			'post_type'           => 'devhorizon_speaker',
			'post_status'         => 'publish',
			'posts_per_page'      => absint( $limit ),
			'meta_key'            => '_devhorizon_featured',
			'meta_value'          => '1',
			'orderby'             => array(
				'menu_order' => 'ASC',
				'title'      => 'ASC',
			),
			'no_found_rows'       => true,
			'ignore_sticky_posts' => true,
		)
	);
}

/**
 * Devuelve las sesiones ordenadas por día y hora.
 *
 * @param array $args Argumentos adicionales de WP_Query.
 * @return WP_Query
 */
function devhorizon_get_sessions( $args = array() ) {
	$defaults = array(
		'post_type'           => 'devhorizon_session',
		'post_status'         => 'publish',
		'posts_per_page'      => -1,
		'meta_query'          => array(
			'day_clause'   => array(
				'key'  => '_devhorizon_day',
				'type' => 'NUMERIC',
			),
			'start_clause' => array(
				'key'  => '_devhorizon_start_minutes',
				'type' => 'NUMERIC',
			),
		),
		'orderby'             => array(
			'day_clause'   => 'ASC',
			'start_clause' => 'ASC',
			'title'        => 'ASC',
		),
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	);

	return new WP_Query( wp_parse_args( $args, $defaults ) );
}

/**
 * Devuelve las sesiones destacadas de la home.
 *
 * @param int $limit Número máximo.
 * @return WP_Query
 */
function devhorizon_get_highlighted_sessions( $limit = 4 ) {
	return new WP_Query(
		array(
			'post_type'           => 'devhorizon_session',
			'post_status'         => 'publish',
			'posts_per_page'      => absint( $limit ),
			'meta_key'            => '_devhorizon_highlighted',
			'meta_value'          => '1',
			'orderby'             => array(
				'menu_order' => 'ASC',
				'title'      => 'ASC',
			),
			'no_found_rows'       => true,
			'ignore_sticky_posts' => true,
		)
	);
}

/**
 * Devuelve la sesión keynote del evento.
 *
 * @return WP_Post|null
 */
function devhorizon_get_keynote_session() {
	$posts = get_posts(
		array(
			'post_type'      => 'devhorizon_session',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'tax_query'      => array(
				array(
					'taxonomy' => 'devhorizon_track',
					'field'    => 'slug',
					'terms'    => 'keynote',
				),
			),
			'meta_key'       => '_devhorizon_start_minutes',
			'orderby'        => 'meta_value_num',
			'order'          => 'ASC',
		)
	);

	return $posts ? $posts[0] : null;
}

/**
 * Devuelve la primera sesión de un speaker.
 *
 * @param int $speaker_id ID del speaker.
 * @return WP_Post|null
 */
function devhorizon_get_speaker_session( $speaker_id ) {
	static $cache = array();

	$speaker_id = (int) $speaker_id;

	if ( array_key_exists( $speaker_id, $cache ) ) {
		return $cache[ $speaker_id ];
	}

	$posts = get_posts(
		array(
			'post_type'      => 'devhorizon_session',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'meta_query'     => array(
				'speaker_clause' => array(
					'key'   => '_devhorizon_speaker_id',
					'value' => $speaker_id,
					'type'  => 'NUMERIC',
				),
				'day_clause'     => array(
					'key'  => '_devhorizon_day',
					'type' => 'NUMERIC',
				),
				'start_clause'   => array(
					'key'  => '_devhorizon_start_minutes',
					'type' => 'NUMERIC',
				),
			),
			'orderby'        => array(
				'day_clause'   => 'ASC',
				'start_clause' => 'ASC',
				'title'        => 'ASC',
			),
		)
	);

	$cache[ $speaker_id ] = $posts ? $posts[0] : null;

	return $cache[ $speaker_id ];
}

/**
 * Devuelve los tracks ordenados.
 *
 * @param string[] $exclude Slugs a excluir.
 * @return WP_Term[]
 */
function devhorizon_get_tracks( $exclude = array() ) {
	$terms = get_terms(
		array(
			'taxonomy'   => 'devhorizon_track',
			'hide_empty' => false,
		)
	);

	if ( ! $terms || is_wp_error( $terms ) ) {
		return array();
	}

	if ( ! empty( $exclude ) ) {
		$terms = array_filter(
			$terms,
			function ( $term ) use ( $exclude ) {
				return ! in_array( $term->slug, $exclude, true );
			}
		);
	}

	usort(
		$terms,
		function ( $a, $b ) {
			$order_a = (int) get_term_meta( $a->term_id, '_devhorizon_order', true );
			$order_b = (int) get_term_meta( $b->term_id, '_devhorizon_order', true );

			if ( $order_a === $order_b ) {
				return strcasecmp( $a->name, $b->name );
			}

			return $order_a <=> $order_b;
		}
	);

	return array_values( $terms );
}
