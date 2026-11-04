<?php
/**
 * Template Name: Speakers - DevHorizon
 * Template Post Type: page
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$devhorizon_speakers = devhorizon_get_all_speakers();
?>
<main id="main-content" class="speakers-section">
	<div class="container">
		<h1 class="section-heading">// <?php esc_html_e( 'speakers', 'tech-conference-site' ); ?></h1>

		<?php if ( $devhorizon_speakers->have_posts() ) : ?>
			<div class="speakers-grid">
				<?php
				while ( $devhorizon_speakers->have_posts() ) :
					$devhorizon_speakers->the_post();
					get_template_part(
						'template-parts/speaker-card',
						null,
						array(
							'speaker_id' => get_the_ID(),
							'variant'    => 'full',
						)
					);
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		<?php else : ?>
			<p class="empty-state"><?php esc_html_e( 'La lista de speakers se anunciará próximamente.', 'tech-conference-site' ); ?></p>
		<?php endif; ?>
	</div>
</main>
<?php
get_footer();
