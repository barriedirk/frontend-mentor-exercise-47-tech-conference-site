<?php
/**
 * Custom Post Types y taxonomía de DevHorizon.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registra los CPT internos de speakers y sesiones.
 */
function devhorizon_register_post_types() {
	$speaker_labels = array(
		'name'                  => __( 'Speakers', 'tech-conference-site' ),
		'singular_name'         => __( 'Speaker', 'tech-conference-site' ),
		'menu_name'             => __( 'Speakers', 'tech-conference-site' ),
		'name_admin_bar'        => __( 'Speaker', 'tech-conference-site' ),
		'add_new'               => __( 'Añadir nuevo', 'tech-conference-site' ),
		'add_new_item'          => __( 'Añadir speaker', 'tech-conference-site' ),
		'new_item'              => __( 'Nuevo speaker', 'tech-conference-site' ),
		'edit_item'             => __( 'Editar speaker', 'tech-conference-site' ),
		'view_item'             => __( 'Ver speaker', 'tech-conference-site' ),
		'all_items'             => __( 'Todos los speakers', 'tech-conference-site' ),
		'search_items'          => __( 'Buscar speakers', 'tech-conference-site' ),
		'not_found'             => __( 'No se han encontrado speakers.', 'tech-conference-site' ),
		'not_found_in_trash'    => __( 'No hay speakers en la papelera.', 'tech-conference-site' ),
		'featured_image'        => __( 'Foto del speaker', 'tech-conference-site' ),
		'set_featured_image'    => __( 'Establecer foto', 'tech-conference-site' ),
		'remove_featured_image' => __( 'Quitar foto', 'tech-conference-site' ),
		'use_featured_image'    => __( 'Usar como foto del speaker', 'tech-conference-site' ),
	);

	register_post_type(
		'devhorizon_speaker',
		array(
			'labels'              => $speaker_labels,
			'public'              => false,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => false,
			'show_in_rest'        => false,
			'has_archive'         => false,
			'rewrite'             => false,
			'query_var'           => false,
			'menu_position'       => 21,
			'menu_icon'           => 'dashicons-microphone',
			'capability_type'     => 'post',
			'map_meta_cap'        => true,
			'hierarchical'        => false,
			'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
		)
	);

	$session_labels = array(
		'name'               => __( 'Sesiones', 'tech-conference-site' ),
		'singular_name'      => __( 'Sesión', 'tech-conference-site' ),
		'menu_name'          => __( 'Sesiones', 'tech-conference-site' ),
		'name_admin_bar'     => __( 'Sesión', 'tech-conference-site' ),
		'add_new'            => __( 'Añadir nueva', 'tech-conference-site' ),
		'add_new_item'       => __( 'Añadir sesión', 'tech-conference-site' ),
		'new_item'           => __( 'Nueva sesión', 'tech-conference-site' ),
		'edit_item'          => __( 'Editar sesión', 'tech-conference-site' ),
		'view_item'          => __( 'Ver sesión', 'tech-conference-site' ),
		'all_items'          => __( 'Todas las sesiones', 'tech-conference-site' ),
		'search_items'       => __( 'Buscar sesiones', 'tech-conference-site' ),
		'not_found'          => __( 'No se han encontrado sesiones.', 'tech-conference-site' ),
		'not_found_in_trash' => __( 'No hay sesiones en la papelera.', 'tech-conference-site' ),
	);

	register_post_type(
		'devhorizon_session',
		array(
			'labels'              => $session_labels,
			'public'              => false,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => false,
			'show_in_rest'        => false,
			'has_archive'         => false,
			'rewrite'             => false,
			'query_var'           => false,
			'menu_position'       => 22,
			'menu_icon'           => 'dashicons-calendar-alt',
			'capability_type'     => 'post',
			'map_meta_cap'        => true,
			'hierarchical'        => false,
			'supports'            => array( 'title', 'editor', 'page-attributes' ),
		)
	);
}
add_action( 'init', 'devhorizon_register_post_types' );

/**
 * Registra la taxonomía de tracks.
 */
function devhorizon_register_taxonomies() {
	$labels = array(
		'name'              => __( 'Tracks', 'tech-conference-site' ),
		'singular_name'     => __( 'Track', 'tech-conference-site' ),
		'search_items'      => __( 'Buscar tracks', 'tech-conference-site' ),
		'all_items'         => __( 'Todos los tracks', 'tech-conference-site' ),
		'parent_item'       => __( 'Track padre', 'tech-conference-site' ),
		'parent_item_colon' => __( 'Track padre:', 'tech-conference-site' ),
		'edit_item'         => __( 'Editar track', 'tech-conference-site' ),
		'update_item'       => __( 'Actualizar track', 'tech-conference-site' ),
		'add_new_item'      => __( 'Añadir track', 'tech-conference-site' ),
		'new_item_name'     => __( 'Nuevo track', 'tech-conference-site' ),
		'menu_name'         => __( 'Tracks', 'tech-conference-site' ),
	);

	register_taxonomy(
		'devhorizon_track',
		array( 'devhorizon_session' ),
		array(
			'labels'            => $labels,
			'public'            => false,
			'publicly_queryable' => false,
			'show_ui'           => true,
			'show_in_menu'      => true,
			'show_in_nav_menus' => false,
			'show_in_rest'      => false,
			'show_admin_column' => true,
			'hierarchical'      => false,
			'rewrite'           => false,
			'query_var'         => false,
		)
	);
}
add_action( 'init', 'devhorizon_register_taxonomies' );

/**
 * Registra metadatos de los tracks.
 */
function devhorizon_register_term_meta() {
	register_term_meta(
		'devhorizon_track',
		'_devhorizon_order',
		array(
			'type'              => 'integer',
			'single'            => true,
			'show_in_rest'      => false,
			'sanitize_callback' => 'absint',
		)
	);

	register_term_meta(
		'devhorizon_track',
		'_devhorizon_color',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => false,
			'sanitize_callback' => 'sanitize_hex_color',
		)
	);
}
add_action( 'init', 'devhorizon_register_term_meta' );

/**
 * Columnas del listado de speakers.
 *
 * @param array $columns Columnas originales.
 * @return array
 */
function devhorizon_speaker_columns( $columns ) {
	$new_columns = array();

	foreach ( $columns as $key => $label ) {
		$new_columns[ $key ] = $label;

		if ( 'title' === $key ) {
			$new_columns['speaker_photo']    = __( 'Foto', 'tech-conference-site' );
			$new_columns['speaker_role']     = __( 'Rol', 'tech-conference-site' );
			$new_columns['speaker_featured'] = __( 'Destacado', 'tech-conference-site' );
		}
	}

	return $new_columns;
}
add_filter( 'manage_devhorizon_speaker_posts_columns', 'devhorizon_speaker_columns' );

/**
 * Contenido de las columnas de speakers.
 *
 * @param string $column  Columna.
 * @param int    $post_id ID del post.
 */
function devhorizon_speaker_column_content( $column, $post_id ) {
	if ( 'speaker_photo' === $column ) {
		if ( has_post_thumbnail( $post_id ) ) {
			echo get_the_post_thumbnail( $post_id, array( 48, 48 ), array( 'style' => 'width:48px;height:48px;object-fit:cover;' ) );
		} else {
			echo '&mdash;';
		}
	}

	if ( 'speaker_role' === $column ) {
		echo esc_html( devhorizon_speaker_affiliation( $post_id ) );
	}

	if ( 'speaker_featured' === $column ) {
		echo get_post_meta( $post_id, '_devhorizon_featured', true ) ? esc_html__( 'Sí', 'tech-conference-site' ) : '&mdash;';
	}
}
add_action( 'manage_devhorizon_speaker_posts_custom_column', 'devhorizon_speaker_column_content', 10, 2 );

/**
 * Columnas del listado de sesiones.
 *
 * @param array $columns Columnas originales.
 * @return array
 */
function devhorizon_session_columns( $columns ) {
	$new_columns = array();

	foreach ( $columns as $key => $label ) {
		$new_columns[ $key ] = $label;

		if ( 'title' === $key ) {
			$new_columns['session_speaker']   = __( 'Speaker', 'tech-conference-site' );
			$new_columns['session_day']       = __( 'Día', 'tech-conference-site' );
			$new_columns['session_time']      = __( 'Hora', 'tech-conference-site' );
			$new_columns['session_track']     = __( 'Track', 'tech-conference-site' );
			$new_columns['session_highlight'] = __( 'Destacada', 'tech-conference-site' );
		}
	}

	return $new_columns;
}
add_filter( 'manage_devhorizon_session_posts_columns', 'devhorizon_session_columns' );

/**
 * Contenido de las columnas de sesiones.
 *
 * @param string $column  Columna.
 * @param int    $post_id ID del post.
 */
function devhorizon_session_column_content( $column, $post_id ) {
	if ( 'session_speaker' === $column ) {
		$speaker_id = (int) get_post_meta( $post_id, '_devhorizon_speaker_id', true );
		echo $speaker_id ? esc_html( get_the_title( $speaker_id ) ) : '&mdash;';
	}

	if ( 'session_day' === $column ) {
		$day = (int) get_post_meta( $post_id, '_devhorizon_day', true );
		echo $day ? esc_html( sprintf( 'Día %d', $day ) ) : '&mdash;';
	}

	if ( 'session_time' === $column ) {
		$start = (string) get_post_meta( $post_id, '_devhorizon_start_time', true );
		$end   = (string) get_post_meta( $post_id, '_devhorizon_end_time', true );
		echo esc_html( trim( $start . ' - ' . $end, ' -' ) );
	}

	if ( 'session_track' === $column ) {
		$terms = get_the_term_list( $post_id, 'devhorizon_track', '', ', ' );
		echo $terms && ! is_wp_error( $terms ) ? wp_kses_post( $terms ) : '&mdash;';
	}

	if ( 'session_highlight' === $column ) {
		echo get_post_meta( $post_id, '_devhorizon_highlighted', true ) ? esc_html__( 'Sí', 'tech-conference-site' ) : '&mdash;';
	}
}
add_action( 'manage_devhorizon_session_posts_custom_column', 'devhorizon_session_column_content', 10, 2 );
