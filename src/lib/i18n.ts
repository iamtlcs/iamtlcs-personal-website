import React from 'react';

/**
 * Helper function to interpolate variables in translation strings
 * Returns an array of React nodes for proper rendering
 * Example: interpolate("Hello {name}!", { name: <strong>World</strong> }) => ["Hello ", <strong>World</strong>, "!"]
 */
export function interpolate(
  template: string,
  params: Record<string, string | React.ReactNode>
): (string | React.ReactNode)[] {
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  const regex = /\{(\w+)\}/g;
  let match;

  while ((match = regex.exec(template)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(template.substring(lastIndex, match.index));
    }
    
    // Add the replacement value
    const key = match[1];
    if (params[key] !== undefined) {
      parts.push(params[key]);
    } else {
      parts.push(match[0]); // Keep the placeholder if no replacement
    }
    
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < template.length) {
    parts.push(template.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [template];
}

