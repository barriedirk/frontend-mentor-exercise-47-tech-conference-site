<?php
/**
 * Funciones principales del tema Tech-conference-site.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DEVHORIZON_VERSION', '1.0.0' );
define( 'DEVHORIZON_DIR', get_template_directory() );
define( 'DEVHORIZON_URI', get_template_directory_uri() );

require_once DEVHORIZON_DIR . '/inc/post-types.php';
require_once DEVHORIZON_DIR . '/inc/meta-fields.php';
require_once DEVHORIZON_DIR . '/inc/template-tags.php';
require_once DEVHORIZON_DIR . '/inc/queries.php';
require_once DEVHORIZON_DIR . '/inc/importer.php';

/**
 * Configuración básica del tema.
 */
function devhorizon_setup() {
	load_theme_textdomain( 'tech-conference-site', DEVHORIZON_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 48,
			'width'       => 220,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	add_image_size( 'devhorizon-speaker', 632, 496, true );
	add_image_size( 'devhorizon-avatar', 260, 260, true );
	add_image_size( 'devhorizon-keynote', 800, 900, true );

	register_nav_menus(
		array(
			'menu-principal' => __( 'Menú Principal', 'tech-conference-site' ),
		)
	);
}
add_action( 'after_setup_theme', 'devhorizon_setup' );

/**
 * Encola los assets del tema.
 */
function devhorizon_enqueue_assets() {
	$style_path = get_stylesheet_directory() . '/style.css';
	$style_ver  = file_exists( $style_path ) ? (string) filemtime( $style_path ) : DEVHORIZON_VERSION;

	wp_enqueue_style(
		'devhorizon-style',
		get_stylesheet_uri(),
		array(),
		$style_ver
	);

	$script_path = DEVHORIZON_DIR . '/js/main.js';
	$script_ver  = file_exists( $script_path ) ? (string) filemtime( $script_path ) : DEVHORIZON_VERSION;

	wp_enqueue_script(
		'devhorizon-main',
		DEVHORIZON_URI . '/js/main.js',
		array(),
		$script_ver,
		true
	);
	wp_script_add_data( 'devhorizon-main', 'strategy', 'defer' );
}
add_action( 'wp_enqueue_scripts', 'devhorizon_enqueue_assets' );

/**
 * Devuelve la URL de una página por su slug, con fallback seguro.
 *
 * @param string $slug Slug de la página.
 * @return string
 */
function devhorizon_page_url( $slug ) {
	$page = get_page_by_path( $slug );

	if ( $page instanceof WP_Post ) {
		return get_permalink( $page );
	}

	// Permite slugs traducidos siempre que la página use la plantilla esperada.
	$template = 'page-' . sanitize_file_name( $slug ) . '.php';
	$matches  = get_posts(
		array(
			'post_type'      => 'page',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => '_wp_page_template',
			'meta_value'     => $template,
		)
	);

	if ( $matches ) {
		return get_permalink( $matches[0] );
	}

	return home_url( '/' . trim( $slug, '/' ) . '/' );
}

/**
 * Renderiza el menú principal.
 *
 * @param string $menu_class Clases del <ul>.
 */
function devhorizon_nav_menu( $menu_class = 'nav-menu nav-menu--desktop' ) {
	wp_nav_menu(
		array(
			'theme_location' => 'menu-principal',
			'container'      => false,
			'depth'          => 1,
			'menu_class'     => $menu_class,
			'menu_id'        => wp_unique_id( 'primary-menu-' ),
			'fallback_cb'    => 'devhorizon_nav_fallback',
			'echo'           => true,
		)
	);
}

/**
 * Fallback del menú cuando aún no se ha creado en el admin.
 *
 * @param array $args Argumentos de wp_nav_menu.
 */
function devhorizon_nav_fallback( $args ) {
	$menu_class = isset( $args['menu_class'] ) ? (string) $args['menu_class'] : 'nav-menu';
	$is_nav     = false !== strpos( $menu_class, 'nav-menu' );

	$items = array(
		array(
			'label'   => __( 'HOME', 'tech-conference-site' ),
			'url'     => home_url( '/' ),
			'current' => is_front_page() || is_page( 'home' ),
		),
		array(
			'label'   => __( 'SCHEDULE', 'tech-conference-site' ),
			'url'     => devhorizon_page_url( 'schedule' ),
			'current' => is_page( 'schedule' ) || is_page_template( 'page-schedule.php' ),
		),
		array(
			'label'   => __( 'SPEAKERS', 'tech-conference-site' ),
			'url'     => devhorizon_page_url( 'speakers' ),
			'current' => is_page( 'speakers' ) || is_page_template( 'page-speakers.php' ),
		),
	);

	$html = '<ul class="' . esc_attr( $menu_class ) . '">';

	foreach ( $items as $item ) {
		$li_class = 'menu-item' . ( $item['current'] ? ' current-menu-item current_page_item' : '' );
		$link     = $is_nav ? ' class="nav-link"' : '';

		$html .= '<li class="' . esc_attr( $li_class ) . '">';
		$html .= '<a' . $link . ' href="' . esc_url( $item['url'] ) . '"';
		$html .= $item['current'] ? ' aria-current="page"' : '';
		$html .= '>' . esc_html( $item['label'] ) . '</a>';
		$html .= '</li>';
	}

	$html .= '</ul>';

	echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Markup construido y escapado en esta función.
}

/**
 * Añade la clase nav-link solo a los enlaces del menú de navegación.
 *
 * @param array   $atts Atributos del enlace.
 * @param WP_Post $item Elemento del menú.
 * @param object  $args Argumentos del menú.
 * @return array
 */
function devhorizon_menu_link_attributes( $atts, $item, $args ) {
	$menu_class = isset( $args->menu_class ) ? (string) $args->menu_class : '';

	if ( 'menu-principal' === ( $args->theme_location ?? '' ) && false !== strpos( $menu_class, 'nav-menu' ) ) {
		$atts['class'] = trim( ( $atts['class'] ?? '' ) . ' nav-link' );
	}

	return $atts;
}
add_filter( 'nav_menu_link_attributes', 'devhorizon_menu_link_attributes', 10, 3 );

/**
 * Evita IDs duplicados cuando el mismo menú se imprime en desktop, móvil y footer.
 *
 * @param string  $menu_id ID del elemento.
 * @param WP_Post $item    Elemento del menú.
 * @param object  $args    Argumentos del menú.
 * @return string
 */
function devhorizon_nav_menu_item_id( $menu_id, $item, $args ) {
	if ( isset( $args->theme_location ) && 'menu-principal' === $args->theme_location ) {
		return '';
	}

	return $menu_id;
}
add_filter( 'nav_menu_item_id', 'devhorizon_nav_menu_item_id', 10, 3 );

/**
 * Añade clases de página al body para el scoping del CSS.
 *
 * @param string[] $classes Clases actuales.
 * @return string[]
 */
function devhorizon_body_classes( $classes ) {
	if ( is_page_template( 'page-home.php' ) || is_front_page() ) {
		$classes[] = 'page-home';
	}

	if ( is_page_template( 'page-speakers.php' ) ) {
		$classes[] = 'page-speakers';
	}

	if ( is_page_template( 'page-schedule.php' ) ) {
		$classes[] = 'page-schedule';
	}

	return $classes;
}
add_filter( 'body_class', 'devhorizon_body_classes' );
