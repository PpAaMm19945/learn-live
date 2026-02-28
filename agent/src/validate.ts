export interface ConstraintJSON {
    constraint_to_enforce?: {
        type?: string;
        description?: string;
        required_evidence?: string[];
        timeout_seconds?: number;
    };
    failure_condition?: {
        condition?: string;
        action?: string;
    };
    success_condition?: {
        condition?: string;
        action?: string;
    };
    role_instruction?: {
        role?: string;
        personality?: string;
        instruction?: string;
        greeting?: string;
    };
}

export function validateConstraint(constraint: any): constraint is ConstraintJSON {
    if (!constraint) return false;

    // Validate constraint_to_enforce
    if (!constraint.constraint_to_enforce || typeof constraint.constraint_to_enforce !== 'object') {
        return false;
    }

    // Validate failure_condition
    if (!constraint.failure_condition || typeof constraint.failure_condition !== 'object') {
        return false;
    }

    // Validate success_condition
    if (!constraint.success_condition || typeof constraint.success_condition !== 'object') {
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
