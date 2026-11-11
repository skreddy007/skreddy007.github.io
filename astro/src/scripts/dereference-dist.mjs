import { cpSync, lstatSync, readdirSync, realpathSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../../dist/', import.meta.url);

function walk(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		const stat = lstatSync(path);
		if (stat.isSymbolicLink()) {
			const target = realpathSync(path);
			unlinkSync(path);
			cpSync(target, path, { recursive: true, dereference: true });
		} else if (stat.isDirectory()) {
			walk(path);
		}
	}
}

walk(dist.pathname);
