<?php
/**
 * Tarjeta de sesión reutilizable.
 *
 * Variantes:
 * - highlight: ticket de la home.
 * - schedule: ticket de la página de schedule.
 *
 * @package Tech_Conference_Site
 *
 * @var array $args Argumentos del partial.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$session_id = isset( $args['session_id'] ) ? (int) $args['session_id'] : 0;
$variant    = isset( $args['variant'] ) ? sanitize_html_class( $args['variant'] ) : 'schedule';
$expanded   = ! empty( $args['expanded'] );

if ( ! $session_id ) {
	return;
}

$title         = get_the_title( $session_id );
$description   = (string) get_post_field( 'post_content', $session_id );
$speaker_name  = devhorizon_session_speaker_name( $session_id );
$company       = devhorizon_session_company( $session_id );
$track_name    = devhorizon_session_track_name( $session_id );
$track_slug    = devhorizon_session_track_slug( $session_id );
$start_time    = (string) get_post_meta( $session_id, '_devhorizon_start_time', true );
$end_time      = (string) get_post_meta( $session_id, '_devhorizon_end_time', true );
$day           = (int) get_post_meta( $session_id, '_devhorizon_day', true );
$location      = (string) get_post_meta( $session_id, '_devhorizon_location', true );
$details_id    = devhorizon_session_details_id( $session_id );
$has_details   = devhorizon_session_has_details( $session_id );
$expanded_attr = $expanded ? 'true' : 'false';
$toggle_label  = $expanded ? __( '— HIDE DETAILS', 'tech-conference-site' ) : __( '+ SHOW DETAILS', 'tech-conference-site' );
$session_url   = 'session-' . $session_id;
?>
<?php if ( 'highlight' === $variant ) : ?>
	<article id="<?php echo esc_attr( $session_url ); ?>" class="ticket-card <?php echo esc_attr( devhorizon_highlight_class( $track_slug ) ); ?>" data-session-id="<?php echo esc_attr( $session_id ); ?>">
		<div class="ticket-track-side" aria-hidden="true"><span><?php echo esc_html( $track_name ); ?></span></div>
		<div class="ticket-track-mobile-tag"><?php echo esc_html( $track_name ); ?></div>

		<div class="ticket-body">
			<h3 class="ticket-title"><?php echo esc_html( $title ); ?></h3>
			<?php if ( $speaker_name ) : ?>
				<div class="ticket-speaker">
					<?php echo esc_html( $speaker_name ); ?>
					<?php if ( $company ) : ?>
						// <?php echo esc_html( $company ); ?>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php if ( $has_details ) : ?>
				<button
					class="ticket-details-toggle"
					type="button"
					data-details-toggle
					aria-expanded="<?php echo esc_attr( $expanded_attr ); ?>"
					aria-controls="<?php echo esc_attr( $details_id ); ?>"
				>
					<?php echo esc_html( $toggle_label ); ?>
				</button>

				<div class="ticket-details" id="<?php echo esc_attr( $details_id ); ?>" <?php echo $expanded ? '' : 'hidden'; ?>>
					<?php if ( $description ) : ?>
						<div class="ticket-description"><?php echo wp_kses_post( wpautop( $description ) ); ?></div>
					<?php endif; ?>
					<?php if ( $location ) : ?>
						<div class="ticket-location"><?php esc_html_e( 'LOCATION:', 'tech-conference-site' ); ?> <?php echo esc_html( $location ); ?></div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="ticket-stub">
			<div class="stub-times">
				<div class="stub-time-main"><?php echo esc_html( $start_time ); ?></div>
				<div class="stub-time-sub"><?php echo esc_html( $end_time ); ?></div>
			</div>

			<div class="stub-barcode" aria-hidden="true">
				<?php echo devhorizon_barcode_svg(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>

			<div class="stub-day"><?php echo esc_html( sprintf( /* translators: %d: day number. */ __( 'DAY %d', 'tech-conference-site' ), $day ) ); ?></div>
		</div>
	</article>
<?php else : ?>
	<article
		id="<?php echo esc_attr( $session_url ); ?>"
		class="ticket-card track-<?php echo esc_attr( $track_slug ); ?>"
		data-session-id="<?php echo esc_attr( $session_id ); ?>"
		data-day="<?php echo esc_attr( $day ); ?>"
		data-track="<?php echo esc_attr( $track_slug ); ?>"
	>
		<div class="card-track-mobile"><span><?php echo esc_html( $track_name ); ?></span></div>
		<div class="card-track-vertical" aria-hidden="true"><span><?php echo esc_html( $track_name ); ?></span></div>

		<div class="card-body">
			<div class="card-content">
				<h2 class="card-title"><?php echo esc_html( $title ); ?></h2>
				<div class="card-speaker">
					<?php if ( $speaker_name ) : ?>
						<span><?php echo esc_html( $speaker_name ); ?></span>
					<?php endif; ?>
					<?php if ( $company ) : ?>
						<span class="speaker-separator">//</span>
						<span><?php echo esc_html( $company ); ?></span>
					<?php endif; ?>
				</div>

				<?php if ( $has_details ) : ?>
					<div class="card-details" id="<?php echo esc_attr( $details_id ); ?>" <?php echo $expanded ? '' : 'hidden'; ?>>
						<?php if ( $description ) : ?>
							<div class="card-description"><?php echo wp_kses_post( wpautop( $description ) ); ?></div>
						<?php endif; ?>
						<?php if ( $location ) : ?>
							<div class="card-location"><?php esc_html_e( 'LOCATION:', 'tech-conference-site' ); ?> <?php echo esc_html( $location ); ?></div>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>

			<?php if ( $has_details ) : ?>
				<button
					class="card-toggle-btn"
					type="button"
					data-details-toggle
					aria-expanded="<?php echo esc_attr( $expanded_attr ); ?>"
					aria-controls="<?php echo esc_attr( $details_id ); ?>"
				>
					<?php echo esc_html( $toggle_label ); ?>
				</button>
			<?php endif; ?>
		</div>

		<aside class="card-stub">
			<div class="stub-times">
				<span class="time-start"><?php echo esc_html( $start_time ); ?></span>
				<span class="time-end"><?php echo esc_html( $end_time ); ?></span>
			</div>

			<div class="stub-barcode">
				<?php echo devhorizon_barcode_svg(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>

			<button
				class="btn-star"
				type="button"
				data-bookmark-toggle
				data-session-id="<?php echo esc_attr( $session_id ); ?>"
				aria-label="<?php esc_attr_e( 'Guardar en mi horario', 'tech-conference-site' ); ?>"
				aria-pressed="false"
			>
				&#9734;
			</button>
		</aside>
	</article>
<?php endif; ?>
