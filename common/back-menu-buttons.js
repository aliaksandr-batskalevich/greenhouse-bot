function backMenuButtons(
  backButtonText = '... Back',
  mainMenuButtonText = '☰ Menu',
  closeButtonText = '× Close',
  closeButtonPath = undefined,
) {
  return async (context, path) => {
    const hasMainMenu = mainMenuButtonText && path.startsWith('/');
    const parts = path.split('/').length;
    const row = [];

    if (parts >= (hasMainMenu ? 4 : 3)) {
      row.push({
        text:
          typeof backButtonText === 'function'
            ? await backButtonText(context, path)
            : backButtonText,
        relativePath: '..',
      });
    }

    if (hasMainMenu && parts >= 3) {
      row.push({
        text:
          typeof mainMenuButtonText === 'function'
            ? await mainMenuButtonText(context, path)
            : mainMenuButtonText,
        relativePath: '/',
      });
    }

    if (closeButtonPath) {
      row.push({
        text:
          typeof closeButtonText === 'function'
            ? await closeButtonText(context, path)
            : closeButtonText,
        relativePath: closeButtonPath,
      });
    }

    return [row];
  };
}

export default backMenuButtons;
