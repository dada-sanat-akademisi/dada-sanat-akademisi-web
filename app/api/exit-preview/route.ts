/**
 * Exit Preview Mode Route Handler
 * 
 * WHY: Allows users to exit Sanity preview mode.
 * 
 * This route disables draft mode and redirects to homepage.
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  draftMode().disable();
  redirect('/');
}
