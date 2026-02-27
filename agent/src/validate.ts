export interface ConstraintJSON {
    constraint_to_enforce?: string[];
    failure_condition?: string[];
    success_condition?: string[];
    role_instruction?: {
        role?: string;
        instruction?: string;
        greeting?: string;
    };
}

export function validateConstraint(constraint: any): constraint is ConstraintJSON {
    if (!constraint) return false;

    // Validate constraint_to_enforce
    if (!constraint.constraint_to_enforce || !Array.isArray(constraint.constraint_to_enforce)) {
        return false;
    }

    // Validate failure_condition
    if (!constraint.failure_condition || !Array.isArray(constraint.failure_condition)) {
        return false;
    }

    // Validate success_condition
    if (!constraint.success_condition || !Array.isArray(constraint.success_condition)) {
        return false;
    }

    // Validate role_instruction
    if (!constraint.role_instruction || typeof constraint.role_instruction !== 'object') {
        return false;
    }

    const roleInst = constraint.role_instruction;
    if (!roleInst.role || !roleInst.instruction || !roleInst.greeting) {
        return false;
    }

    return true;
}
