<?php
/**
 * Theme header.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$devhorizon_logo_id = (int) get_theme_mod( 'custom_logo' );
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<?php wp_head(); ?>
	<?php if ( ! has_site_icon() ) : ?>
		<link rel="icon" href="<?php echo esc_url( devhorizon_image_url( 'favicon-32x32.png' ) ); ?>" sizes="32x32" type="image/png" />
	<?php endif; ?>
</head>
<body <?php body_class(); ?> id="top">
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#main-content"><?php esc_html_e( 'Skip to content', 'tech-conference-site' ); ?></a>

<header class="site-header">
	<div class="container nav-wrapper">
		<a class="brand-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'DevHorizon 2026 — Home', 'tech-conference-site' ); ?>">
			<?php
			if ( $devhorizon_logo_id ) {
				echo wp_get_attachment_image(
					$devhorizon_logo_id,
					'full',
					false,
					array(
						'class' => 'custom-logo',
						'alt'   => get_bloginfo( 'name' ),
					)
				);
			} else {
				echo 'DEVHORIZON_26';
			}
			?>
		</a>

		<nav class="main-nav" aria-label="<?php esc_attr_e( 'Primary navigation', 'tech-conference-site' ); ?>">
			<?php devhorizon_nav_menu( 'nav-menu nav-menu--desktop' ); ?>
		</nav>

		<button class="mobile-menu-toggle" id="menuToggle" type="button" aria-label="<?php esc_attr_e( 'Open navigation menu', 'tech-conference-site' ); ?>" aria-expanded="false" aria-controls="mobileDrawer">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true" focusable="false">
				<line x1="3" y1="6" x2="21" y2="6"></line>
				<line x1="3" y1="12" x2="21" y2="12"></line>
				<line x1="3" y1="18" x2="21" y2="18"></line>
			</svg>
		</button>
	</div>

	<div class="mobile-drawer" id="mobileDrawer" role="navigation" aria-label="<?php esc_attr_e( 'Mobile navigation', 'tech-conference-site' ); ?>">
		<?php devhorizon_nav_menu( 'nav-menu nav-menu--mobile' ); ?>
	</div>
</header>
