import type { Meta, StoryObj } from '@storybook/react';

function Placeholder() {
  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h2>react-process-graph</h2>
      <p>Stories will appear here as the library is built.</p>
    </div>
  );
}

const meta: Meta<typeof Placeholder> = {
  title: 'Placeholder',
  component: Placeholder,
};

export default meta;
type Story = StoryObj<typeof Placeholder>;

export const Default: Story = {};
