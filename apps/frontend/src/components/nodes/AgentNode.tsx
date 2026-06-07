"use client"
import BaseNode from "./BaseNode"

export default function AgentNode(props: any) {
  return (
    <BaseNode
      {...props}
      colorClass="bg-blue-50"
      borderClass="border-blue-400"
      icon="🤖"
    />
  )
}
