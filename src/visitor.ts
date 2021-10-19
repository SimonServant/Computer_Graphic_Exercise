import { GroupNode, SphereNode, AABoxNode, TextureBoxNode, CameraNode, LightNode } from './nodes';

export default interface Visitor {
    visitGroupNode(node: GroupNode): void;
    visitSphereNode(node: SphereNode): void;
    visitAABoxNode(node: AABoxNode): void;
    visitTextureBoxNode(node: TextureBoxNode): void;
    visitCameraNode(node: CameraNode): void;
    visitLightNode(node: LightNode): void;
}