<?php
/**
 * Modal reutilizable de speaker.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div
	id="speakerModal"
	class="modal-backdrop"
	role="dialog"
	aria-modal="true"
	aria-labelledby="speakerName"
	aria-hidden="true"
>
	<div class="modal-dialog" role="document">
		<button
			type="button"
			class="modal-close-btn"
			data-modal-close
			aria-label="<?php esc_attr_e( 'Cerrar ventana', 'tech-conference-site' ); ?>"
		>
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true" focusable="false">
				<line x1="2" y1="2" x2="12" y2="12"></line>
				<line x1="12" y1="2" x2="2" y2="12"></line>
			</svg>
		</button>

		<div class="speaker-profile">
			<div class="speaker-avatar-frame">
				<img
					src="<?php echo esc_url( devhorizon_image_url( 'pattern-avatar-bg.svg' ) ); ?>"
					alt=""
					class="speaker-avatar"
					data-modal-photo
				/>
			</div>
			<div class="speaker-meta">
				<h2 id="speakerName" class="speaker-name" data-modal-name></h2>
				<p class="speaker-role" data-modal-role></p>
			</div>
		</div>

		<hr class="modal-divider" />

		<p class="speaker-bio" data-modal-bio></p>

		<hr class="modal-divider" />

		<h3 class="talk-section-title">// <?php esc_html_e( 'TALK', 'tech-conference-site' ); ?></h3>

		<div class="talk-ticket">
			<div class="ticket-badge" data-modal-track><?php esc_html_e( 'TALK', 'tech-conference-site' ); ?></div>

			<div class="ticket-body">
				<h4 class="ticket-title" data-modal-talk-title></h4>
				<p class="ticket-author">
					<span data-modal-author-name></span>
					<span class="ticket-slash">//</span>
					<span data-modal-company></span>
				</p>
			</div>

			<div class="ticket-stub">
				<div class="ticket-schedule">
					<span class="ticket-time-main" data-modal-time-start></span>
					<span class="ticket-time-sub" data-modal-time-end></span>
				</div>

				<div class="ticket-barcode" aria-hidden="true">
					<span class="bar-thick"></span>
					<span class="bar-thin"></span>
					<span class="bar-medium"></span>
					<span class="bar-thin"></span>
					<span class="bar-thick"></span>
					<span class="bar-thin"></span>
					<span class="bar-medium"></span>
					<span class="bar-thick"></span>
					<span class="bar-thin"></span>
					<span class="bar-medium"></span>
					<span class="bar-thick"></span>
				</div>

				<button
					type="button"
					class="ticket-fav-btn"
					data-bookmark-toggle
					data-session-id=""
					aria-label="<?php esc_attr_e( 'Guardar en mi horario', 'tech-conference-site' ); ?>"
					aria-pressed="false"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
						<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
