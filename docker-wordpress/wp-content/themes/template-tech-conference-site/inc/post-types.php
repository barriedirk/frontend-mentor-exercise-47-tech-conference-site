<?php
/**
 * DevHorizon Custom Post Types and taxonomy.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the internal speaker and session CPTs.
 */
function devhorizon_register_post_types() {
	$speaker_labels = array(
		'name'                  => __( 'Speakers', 'tech-conference-site' ),
		'singular_name'         => __( 'Speaker', 'tech-conference-site' ),
		'menu_name'             => __( 'Speakers', 'tech-conference-site' ),
		'name_admin_bar'        => __( 'Speaker', 'tech-conference-site' ),
		'add_new'               => __( 'Add New', 'tech-conference-site' ),
		'add_new_item'          => __( 'Add New Speaker', 'tech-conference-site' ),
		'new_item'              => __( 'New Speaker', 'tech-conference-site' ),
		'edit_item'             => __( 'Edit Speaker', 'tech-conference-site' ),
		'view_item'             => __( 'View Speaker', 'tech-conference-site' ),
		'all_items'             => __( 'All Speakers', 'tech-conference-site' ),
		'search_items'          => __( 'Search Speakers', 'tech-conference-site' ),
		'not_found'             => __( 'No speakers found.', 'tech-conference-site' ),
		'not_found_in_trash'    => __( 'No speakers found in Trash.', 'tech-conference-site' ),
		'featured_image'        => __( 'Speaker Photo', 'tech-conference-site' ),
		'set_featured_image'    => __( 'Set featured image', 'tech-conference-site' ),
		'remove_featured_image' => __( 'Remove featured image', 'tech-conference-site' ),
		'use_featured_image'    => __( 'Use as speaker photo', 'tech-conference-site' ),
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
		'name'               => __( 'Sessions', 'tech-conference-site' ),
		'singular_name'      => __( 'Session', 'tech-conference-site' ),
		'menu_name'          => __( 'Sessions', 'tech-conference-site' ),
		'name_admin_bar'     => __( 'Session', 'tech-conference-site' ),
		'add_new'            => __( 'Add New', 'tech-conference-site' ),
		'add_new_item'       => __( 'Add New Session', 'tech-conference-site' ),
		'new_item'           => __( 'New Session', 'tech-conference-site' ),
		'edit_item'          => __( 'Edit Session', 'tech-conference-site' ),
		'view_item'          => __( 'View Session', 'tech-conference-site' ),
		'all_items'          => __( 'All Sessions', 'tech-conference-site' ),
		'search_items'       => __( 'Search Sessions', 'tech-conference-site' ),
		'not_found'          => __( 'No sessions found.', 'tech-conference-site' ),
		'not_found_in_trash' => __( 'No sessions found in Trash.', 'tech-conference-site' ),
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
 * Registers the tracks taxonomy.
 */
function devhorizon_register_taxonomies() {
	$labels = array(
		'name'              => __( 'Tracks', 'tech-conference-site' ),
		'singular_name'     => __( 'Track', 'tech-conference-site' ),
		'search_items'      => __( 'Search Tracks', 'tech-conference-site' ),
		'all_items'         => __( 'All Tracks', 'tech-conference-site' ),
		'parent_item'       => __( 'Parent Track', 'tech-conference-site' ),
		'parent_item_colon' => __( 'Parent Track:', 'tech-conference-site' ),
		'edit_item'         => __( 'Edit Track', 'tech-conference-site' ),
		'update_item'       => __( 'Update Track', 'tech-conference-site' ),
		'add_new_item'      => __( 'Add New Track', 'tech-conference-site' ),
		'new_item_name'     => __( 'New Track', 'tech-conference-site' ),
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
 * Registers track metadata.
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
 * Speaker list columns.
 *
 * @param array $columns Original columns.
 * @return array
 */
function devhorizon_speaker_columns( $columns ) {
	$new_columns = array();

	foreach ( $columns as $key => $label ) {
		$new_columns[ $key ] = $label;

		if ( 'title' === $key ) {
			$new_columns['speaker_photo']    = __( 'Photo', 'tech-conference-site' );
			$new_columns['speaker_role']     = __( 'Role', 'tech-conference-site' );
			$new_columns['speaker_featured'] = __( 'Featured', 'tech-conference-site' );
		}
	}

	return $new_columns;
}
add_filter( 'manage_devhorizon_speaker_posts_columns', 'devhorizon_speaker_columns' );

/**
 * Speaker column content.
 *
 * @param string $column  Column.
 * @param int    $post_id Post ID.
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
		echo get_post_meta( $post_id, '_devhorizon_featured', true ) ? esc_html__( 'Yes', 'tech-conference-site' ) : '&mdash;';
	}
}
add_action( 'manage_devhorizon_speaker_posts_custom_column', 'devhorizon_speaker_column_content', 10, 2 );

/**
 * Session list columns.
 *
 * @param array $columns Original columns.
 * @return array
 */
function devhorizon_session_columns( $columns ) {
	$new_columns = array();

	foreach ( $columns as $key => $label ) {
		$new_columns[ $key ] = $label;

		if ( 'title' === $key ) {
			$new_columns['session_speaker']   = __( 'Speaker', 'tech-conference-site' );
			$new_columns['session_day']       = __( 'Day', 'tech-conference-site' );
			$new_columns['session_time']      = __( 'Time', 'tech-conference-site' );
			$new_columns['session_track']     = __( 'Track', 'tech-conference-site' );
			$new_columns['session_highlight'] = __( 'Featured', 'tech-conference-site' );
		}
	}

	return $new_columns;
}
add_filter( 'manage_devhorizon_session_posts_columns', 'devhorizon_session_columns' );

/**
 * Session column content.
 *
 * @param string $column  Column.
 * @param int    $post_id Post ID.
 */
function devhorizon_session_column_content( $column, $post_id ) {
	if ( 'session_speaker' === $column ) {
		$speaker_id = (int) get_post_meta( $post_id, '_devhorizon_speaker_id', true );
		echo $speaker_id ? esc_html( get_the_title( $speaker_id ) ) : '&mdash;';
	}

	if ( 'session_day' === $column ) {
		$day = (int) get_post_meta( $post_id, '_devhorizon_day', true );
		echo $day ? esc_html( sprintf( 'Day %d', $day ) ) : '&mdash;';
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
		echo get_post_meta( $post_id, '_devhorizon_highlighted', true ) ? esc_html__( 'Yes', 'tech-conference-site' ) : '&mdash;';
	}
}
add_action( 'manage_devhorizon_session_posts_custom_column', 'devhorizon_session_column_content', 10, 2 );
