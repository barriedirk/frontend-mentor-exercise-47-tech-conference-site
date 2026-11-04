<?php
/**
 * Template Name: Home - DevHorizon
 * Template Post Type: page
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$devhorizon_keynote        = devhorizon_get_keynote_session();
$devhorizon_keynote_speaker = $devhorizon_keynote ? devhorizon_session_speaker_id( $devhorizon_keynote->ID ) : 0;
$devhorizon_keynote_name   = $devhorizon_keynote_speaker ? get_the_title( $devhorizon_keynote_speaker ) : '';
$devhorizon_keynote_role   = $devhorizon_keynote_speaker ? devhorizon_speaker_affiliation( $devhorizon_keynote_speaker ) : '';
$devhorizon_keynote_photo  = $devhorizon_keynote_speaker ? devhorizon_speaker_photo_url( $devhorizon_keynote_speaker, 'devhorizon-keynote' ) : devhorizon_image_url( 'pattern-avatar-bg.svg' );
$devhorizon_keynote_day    = $devhorizon_keynote ? (int) get_post_meta( $devhorizon_keynote->ID, '_devhorizon_day', true ) : 1;
$devhorizon_keynote_start  = $devhorizon_keynote ? (string) get_post_meta( $devhorizon_keynote->ID, '_devhorizon_start_time', true ) : '';
$devhorizon_keynote_room   = $devhorizon_keynote ? (string) get_post_meta( $devhorizon_keynote->ID, '_devhorizon_location', true ) : '';
$devhorizon_keynote_attrs  = $devhorizon_keynote_speaker ? devhorizon_speaker_modal_attrs( $devhorizon_keynote_speaker ) : '';
$devhorizon_featured       = devhorizon_get_featured_speakers( 8 );
$devhorizon_highlights     = devhorizon_get_highlighted_sessions( 4 );
$devhorizon_tracks         = devhorizon_get_tracks( array( 'keynote' ) );
?>
<main id="main-content">
	<section class="hero-section" id="home">
		<div class="container">
			<div class="hero-grid">
				<article class="hero-main-card">
					<div class="hero-watermark" aria-hidden="true">HORIZON</div>

					<h1 class="hero-title">
						<?php esc_html_e( 'where code meets the machine', 'tech-conference-site' ); ?><span class="cursor-char">_</span>
					</h1>

					<div class="hero-meta-strip">
						<span><?php esc_html_e( 'NOV 15-17, 2026', 'tech-conference-site' ); ?></span>
						<span><?php esc_html_e( 'PIER 70, SF', 'tech-conference-site' ); ?></span>
					</div>
				</article>

				<article class="hero-keynote-card">
					<div class="keynote-content">
						<div>
							<div class="keynote-tag">// <?php esc_html_e( 'FEATURED KEYNOTE', 'tech-conference-site' ); ?></div>
							<?php if ( $devhorizon_keynote ) : ?>
								<h2 class="keynote-name"><?php echo esc_html( $devhorizon_keynote_name ); ?></h2>
								<div class="keynote-role"><?php echo esc_html( $devhorizon_keynote_role ); ?></div>
								<h3 class="keynote-talk-title"><?php echo esc_html( get_the_title( $devhorizon_keynote->ID ) ); ?></h3>
								<div class="keynote-time">
									<?php
									echo esc_html(
										implode(
											' / ',
											array_filter(
												array(
													devhorizon_event_date_label( $devhorizon_keynote_day ),
													$devhorizon_keynote_start,
													$devhorizon_keynote_room,
												)
											)
										)
									);
									?>
								</div>
							<?php else : ?>
								<h2 class="keynote-name"><?php esc_html_e( 'the lineup is loading', 'tech-conference-site' ); ?></h2>
								<div class="keynote-role"><?php esc_html_e( 'SPEAKERS AND SESSIONS COMING SOON', 'tech-conference-site' ); ?></div>
							<?php endif; ?>
						</div>

						<?php if ( $devhorizon_keynote ) : ?>
							<a class="keynote-btn" href="<?php echo esc_url( devhorizon_page_url( 'schedule' ) . '#session-' . $devhorizon_keynote->ID ); ?>" <?php echo $devhorizon_keynote_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
								<span><?php esc_html_e( 'VIEW TALK', 'tech-conference-site' ); ?></span>
								<span aria-hidden="true">&rarr;</span>
							</a>
						<?php endif; ?>
					</div>

					<div class="keynote-photo-wrap">
						<img src="<?php echo esc_url( $devhorizon_keynote_photo ); ?>" alt="<?php echo esc_attr( $devhorizon_keynote_name ); ?>" loading="eager" />
					</div>
				</article>
			</div>
		</div>
	</section>

	<section class="tracks-section" id="tracks">
		<div class="container">
			<span class="section-tag">// <?php esc_html_e( 'TRACKS', 'tech-conference-site' ); ?></span>

			<?php if ( ! empty( $devhorizon_tracks ) ) : ?>
				<div class="tracks-grid">
					<?php foreach ( $devhorizon_tracks as $devhorizon_track ) : ?>
						<div class="track-card">
							<h3 class="track-name"><?php echo esc_html( $devhorizon_track->name ); ?></h3>
							<p class="track-desc"><?php echo esc_html( $devhorizon_track->description ); ?></p>
						</div>
					<?php endforeach; ?>
				</div>
			<?php else : ?>
				<p class="empty-state"><?php esc_html_e( 'Los tracks se anunciarán próximamente.', 'tech-conference-site' ); ?></p>
			<?php endif; ?>
		</div>
	</section>

	<section class="speakers-section" id="speakers">
		<div class="container">
			<span class="section-tag">// <?php esc_html_e( 'FEATURED_SPEAKERS', 'tech-conference-site' ); ?></span>

			<?php if ( $devhorizon_featured->have_posts() ) : ?>
				<div class="speakers-grid">
					<?php
					while ( $devhorizon_featured->have_posts() ) :
						$devhorizon_featured->the_post();
						get_template_part(
							'template-parts/speaker-card',
							null,
							array(
								'speaker_id' => get_the_ID(),
								'variant'    => 'home',
							)
						);
					endwhile;
					wp_reset_postdata();
					?>
				</div>

				<div class="section-cta-wrap">
					<a class="btn-secondary" href="<?php echo esc_url( devhorizon_page_url( 'speakers' ) ); ?>">
						<?php esc_html_e( 'VIEW ALL SPEAKERS', 'tech-conference-site' ); ?>
					</a>
				</div>
			<?php else : ?>
				<p class="empty-state"><?php esc_html_e( 'La lista de speakers se anunciará próximamente.', 'tech-conference-site' ); ?></p>
			<?php endif; ?>
		</div>
	</section>

	<section class="schedule-section" id="schedule">
		<div class="container">
			<span class="section-tag">// <?php esc_html_e( 'SCHEDULE_HIGHLIGHTS', 'tech-conference-site' ); ?></span>

			<?php if ( $devhorizon_highlights->have_posts() ) : ?>
				<div class="schedule-stack">
					<?php
					$devhorizon_index = 0;
					while ( $devhorizon_highlights->have_posts() ) :
						$devhorizon_highlights->the_post();
						get_template_part(
							'template-parts/session-card',
							null,
							array(
								'session_id' => get_the_ID(),
								'variant'    => 'highlight',
								'expanded'   => 0 === $devhorizon_index,
							)
						);
						++$devhorizon_index;
					endwhile;
					wp_reset_postdata();
					?>
				</div>

				<div class="section-cta-wrap">
					<a class="btn-secondary" href="<?php echo esc_url( devhorizon_page_url( 'schedule' ) ); ?>">
						<?php esc_html_e( 'VIEW FULL SCHEDULE', 'tech-conference-site' ); ?>
					</a>
				</div>
			<?php else : ?>
				<p class="empty-state"><?php esc_html_e( 'Los highlights se anunciarán próximamente.', 'tech-conference-site' ); ?></p>
			<?php endif; ?>
		</div>
	</section>
</main>
<?php
get_footer();
