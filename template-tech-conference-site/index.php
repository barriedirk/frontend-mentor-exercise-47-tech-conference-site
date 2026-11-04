<?php
/**
 * Generic theme fallback.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<main id="main-content" class="container default-main">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : ?>
			<?php the_post(); ?>
			<article <?php post_class( 'default-post' ); ?>>
				<h1 class="page-title"><?php the_title(); ?></h1>
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
			</article>
		<?php endwhile; ?>
	<?php else : ?>
		<h1 class="page-title"><?php esc_html_e( '// nothing_found', 'tech-conference-site' ); ?></h1>
		<p class="empty-state"><?php esc_html_e( 'No content to display.', 'tech-conference-site' ); ?></p>
	<?php endif; ?>
</main>
<?php
get_footer();
