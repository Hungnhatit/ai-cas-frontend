import { Extension } from '@tiptap/core';

// Extension này sẽ chặn phím Tab mặc định của trình duyệt
const TabKeyExtension = Extension.create({
  name: 'tabKey',

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.commands.sinkListItem('listItem')) {
          return true;
        }

        return this.editor.commands.insertContent('\u00A0\u00A0\u00A0\u00A0');
      },
      'Shift-Tab': () => {
        return this.editor.commands.liftListItem('listItem');
      },
    };
  },
});

export default TabKeyExtension;