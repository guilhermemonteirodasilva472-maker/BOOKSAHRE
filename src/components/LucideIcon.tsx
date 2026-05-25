/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number | string;
  strokeWidth?: number;
}

export default function LucideIcon({
  name,
  className = '',
  size = 20,
  strokeWidth = 2
}: LucideIconProps) {
  // Safe resolver
  // Fallback to 'Book' if icon name doesn't match
  const IconComponent = (icons as any)[name] || icons.Book;

  return (
    <IconComponent
      className={className}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}
