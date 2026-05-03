import type { PositionedGroup, ProcessGraphProps } from '../types';

interface GroupLayerProps<TGroup> {
  groups: PositionedGroup<TGroup>[];
  renderGroup?: ProcessGraphProps<unknown, TGroup>['renderGroup'];
  nodeChildren: Map<string, React.ReactNode>;
}

function DefaultGroupContainer(props: {
  group: PositionedGroup;
  children: React.ReactNode;
}) {
  return (
    <div
      data-rpg-group={props.group.id}
      style={{
        position: 'absolute',
        left: props.group.x,
        top: props.group.y,
        width: props.group.width,
        height: props.group.height,
        border: '1.5px dashed #94a3b8',
        borderRadius: 6,
        boxSizing: 'border-box',
      }}
      role="group"
      aria-label={`Group ${props.group.id}`}
    >
      {props.children}
    </div>
  );
}

export function GroupLayer<TGroup>({
  groups,
  renderGroup,
  nodeChildren,
}: GroupLayerProps<TGroup>) {
  return (
    <>
      {groups.map((group) => {
        const children = nodeChildren.get(group.id) ?? null;
        if (renderGroup) {
          return (
            <div
              key={group.id}
              style={{ position: 'absolute', left: group.x, top: group.y }}
            >
              {renderGroup(group, children)}
            </div>
          );
        }
        return (
          <DefaultGroupContainer key={group.id} group={group}>
            {children}
          </DefaultGroupContainer>
        );
      })}
    </>
  );
}
