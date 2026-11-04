<?php
/**
 * Template Name: Schedule - DevHorizon
 * Template Post Type: page
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$devhorizon_sessions = devhorizon_get_sessions();
$devhorizon_tracks   = devhorizon_get_tracks( array( 'keynote' ) );
?>
<main id="main-content" class="schedule-main container">
	<h1 class="page-title">// <?php esc_html_e( 'schedule', 'tech-conference-site' ); ?></h1>

	<section class="filter-bar" aria-label="<?php esc_attr_e( 'Schedule filters', 'tech-conference-site' ); ?>">
		<div class="day-group" role="group" aria-label="<?php esc_attr_e( 'Conference days', 'tech-conference-site' ); ?>">
			<button class="btn-day active" type="button" data-filter-day="1" aria-pressed="true"><?php esc_html_e( 'DAY 01', 'tech-conference-site' ); ?></button>
			<button class="btn-day" type="button" data-filter-day="2" aria-pressed="false"><?php esc_html_e( 'DAY 02', 'tech-conference-site' ); ?></button>
			<button class="btn-day" type="button" data-filter-day="3" aria-pressed="false"><?php esc_html_e( 'DAY 03', 'tech-conference-site' ); ?></button>
		</div>

		<span class="filter-divider" aria-hidden="true"></span>

		<div class="track-group" role="group" aria-label="<?php esc_attr_e( 'Topic categories', 'tech-conference-site' ); ?>">
			<?php foreach ( $devhorizon_tracks as $devhorizon_track ) : ?>
				<button
					class="btn-pill"
					type="button"
					data-filter-track="<?php echo esc_attr( $devhorizon_track->slug ); ?>"
					aria-pressed="false"
				>
					<?php echo esc_html( devhorizon_track_filter_label( $devhorizon_track->slug ) ); ?>
				</button>
			<?php endforeach; ?>

			<button class="btn-pill pill-dashed" type="button" data-filter-mine aria-pressed="false">
				<?php esc_html_e( 'MY SCHEDULE', 'tech-conference-site' ); ?>
			</button>

			<button class="btn-pill pill-clear" type="button" data-filter-clear>
				<?php esc_html_e( 'CLEAR', 'tech-conference-site' ); ?>
			</button>
		</div>
	</section>

	<?php if ( $devhorizon_sessions->have_posts() ) : ?>
		<section class="schedule-list" aria-label="<?php esc_attr_e( 'Schedule sessions', 'tech-conference-site' ); ?>">
			<?php
			$devhorizon_index = 0;
			while ( $devhorizon_sessions->have_posts() ) :
				$devhorizon_sessions->the_post();
				get_template_part(
					'template-parts/session-card',
					null,
					array(
						'session_id' => get_the_ID(),
						'variant'    => 'schedule',
						'expanded'   => 0 === $devhorizon_index,
					)
				);
				++$devhorizon_index;
			endwhile;
			wp_reset_postdata();
			?>
		</section>

		<p class="schedule-empty" hidden>
			<?php esc_html_e( 'No sessions match the selected filters.', 'tech-conference-site' ); ?>
		</p>
	<?php else : ?>
		<p class="schedule-empty">
			<?php esc_html_e( 'The schedule will be announced soon.', 'tech-conference-site' ); ?>
		</p>
	<?php endif; ?>
</main>
<?php
get_footer();
