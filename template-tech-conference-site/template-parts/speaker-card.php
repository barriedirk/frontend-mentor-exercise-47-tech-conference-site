<?php
/**
 * Tarjeta de speaker reutilizable.
 *
 * @package Tech_Conference_Site
 *
 * @var array $args Argumentos del partial.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$speaker_id = isset( $args['speaker_id'] ) ? (int) $args['speaker_id'] : 0;
$variant    = isset( $args['variant'] ) ? sanitize_html_class( $args['variant'] ) : 'full';

if ( ! $speaker_id ) {
	return;
}

$speaker_name = get_the_title( $speaker_id );
$affiliation  = devhorizon_speaker_affiliation( $speaker_id, 'home' !== $variant );
$session      = devhorizon_get_speaker_session( $speaker_id );
$talk_title   = $session ? get_the_title( $session->ID ) : '';
$modal_attrs  = devhorizon_speaker_modal_attrs( $speaker_id );
$aria_label   = sprintf(
	/* translators: %s: speaker name. */
	__( 'Ver detalles de %s', 'tech-conference-site' ),
	$speaker_name
);
?>
<?php if ( 'home' === $variant ) : ?>
	<article
		class="speaker-card speaker-card--home"
		<?php echo $modal_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		tabindex="0"
		role="button"
		aria-label="<?php echo esc_attr( $aria_label ); ?>"
	>
		<div class="speaker-photo-box">
			<?php echo devhorizon_speaker_photo_html( $speaker_id, 'devhorizon-speaker', 'speaker-card-img' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>

		<div class="speaker-details">
			<h3 class="speaker-name"><?php echo esc_html( $speaker_name ); ?></h3>
			<?php if ( $affiliation ) : ?>
				<p class="speaker-affiliation"><?php echo esc_html( $affiliation ); ?></p>
			<?php endif; ?>
			<?php if ( $talk_title ) : ?>
				<div class="speaker-talk-badge"><?php echo esc_html( $talk_title ); ?></div>
			<?php endif; ?>
		</div>
	</article>
<?php else : ?>
	<article
		class="speaker-card speaker-card--full"
		<?php echo $modal_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		tabindex="0"
		role="button"
		aria-label="<?php echo esc_attr( $aria_label ); ?>"
	>
		<div class="card-image-wrap">
			<?php echo devhorizon_speaker_photo_html( $speaker_id, 'devhorizon-speaker', 'card-image' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>

		<div class="card-body">
			<div class="card-top">
				<h2 class="speaker-name"><?php echo esc_html( $speaker_name ); ?></h2>
				<?php if ( $affiliation ) : ?>
					<p class="speaker-role"><?php echo esc_html( $affiliation ); ?></p>
				<?php endif; ?>
			</div>

			<?php if ( $talk_title ) : ?>
				<div class="card-talk">
					<p class="talk-title"><?php echo esc_html( $talk_title ); ?></p>
				</div>
			<?php endif; ?>
		</div>
	</article>
<?php endif; ?>
