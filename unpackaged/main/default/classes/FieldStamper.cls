public abstract class FieldStamper {
    public abstract void stamp(SObject sobj);

    public virtual Boolean isQualified(SObject sobj) {
        return true;
    }

    public virtual void setStampers(SObject sobj, List<SObjectField> fields) {
        return;
    }
}