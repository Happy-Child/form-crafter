export default {
    '**/*.(ts|tsx)': (filenames) => [`pnpm run lint:eslint ${filenames.join(' ')}`, 'pnpm run lint:tsc'],
}
