import type { StaticImageData } from 'next/image';
import applyResultApplied from '@/public/images/apply-result-applied.png';
import applyResultRestart from '@/public/images/apply-result-restart.png';
import bulkEdit from '@/public/images/bulk-edit.png';
import changeHistory from '@/public/images/change-history.png';
import conflict from '@/public/images/conflict.png';
import dashboard from '@/public/images/dashboard.png';
import editorDark from '@/public/images/editor-dark.png';
import editor from '@/public/images/editor.png';
import reviewDialog from '@/public/images/review-dialog.png';
import serverPage from '@/public/images/server-page.png';

export interface ScreenshotEntry {
  image: StaticImageData;
  alt: string;
  caption: string;
}

/** Screenshots of the web app at 1600 by 900 pixels. The captions are those of the store listings. */
export const screenshots = {
  dashboard: {
    image: dashboard,
    alt: 'The Your servers page listing one server, Survival, online, with its software, bridge version, plugin count and settings page count.',
    caption: 'Dashboard: your servers with live online status.',
  },
  'server-page': {
    image: serverPage,
    alt: 'The server page of Survival: facts, the ComfiConfDemo plugin with its Vouchers settings page, recent activity and Remove this server.',
    caption: 'Supported plugins: each server lists the plugins that support ComfiConf.',
  },
  editor: {
    image: editor,
    alt: 'The editor with modified settings marked in brass, a slider, a toggle and the material picker open, and the unsaved changes bar at the bottom.',
    caption:
      "The editor: toggles, sliders, dropdowns and a material picker, generated from the plugin's description.",
  },
  'bulk-edit': {
    image: bulkEdit,
    alt: 'The Vouchers list with four vouchers selected, the Bulk edit button, and cooldown and enabled controls in the entries table.',
    caption: 'Bulk editing: change many entries at once.',
  },
  'review-dialog': {
    image: reviewDialog,
    alt: 'The Review changes dialog listing each change with its before and after value.',
    caption: 'Review before apply: every change with its old and new value, checked by the plugin.',
  },
  'apply-result-applied': {
    image: applyResultApplied,
    alt: 'The apply result Changes applied and active.',
    caption: 'Real results: the plugin confirms that the changes are active now.',
  },
  'apply-result-restart': {
    image: applyResultRestart,
    alt: 'The apply result Saved. A restart is needed, listing the setting that needs a restart.',
    caption: 'Restart required: saved, and active after the next server restart.',
  },
  conflict: {
    image: conflict,
    alt: 'The Review changes dialog with the warning The configuration changed on the server and its Reload latest values button.',
    caption: 'Conflict protection: changes made in the meantime are never overwritten.',
  },
  'change-history': {
    image: changeHistory,
    alt: 'Recent activity on the server page with applied changes, their result badges and the changed settings.',
    caption: 'Change history: what changed, when, and with which result.',
  },
  'editor-dark': {
    image: editorDark,
    alt: 'The editor in the dark theme.',
    caption: 'Dark theme: the editor in the dark theme.',
  },
} satisfies Record<string, ScreenshotEntry>;

export type ScreenshotId = keyof typeof screenshots;
