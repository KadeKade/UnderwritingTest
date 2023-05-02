package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.DataType;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A CriteriaProperty.
 */
@Entity
@Table(name = "criteria_property")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CriteriaProperty implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "property_name")
    private String propertyName;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type")
    private DataType propertyType;

    @Column(name = "display_name_de")
    private String displayNameDe;

    @Column(name = "display_name_en")
    private String displayNameEn;

    @Column(name = "display_name_fr")
    private String displayNameFr;

    @Column(name = "display_name_it")
    private String displayNameIt;

    @ManyToOne
    @JsonIgnoreProperties(value = { "criteria" }, allowSetters = true)
    private Criteria property;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CriteriaProperty id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPropertyName() {
        return this.propertyName;
    }

    public CriteriaProperty propertyName(String propertyName) {
        this.setPropertyName(propertyName);
        return this;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public DataType getPropertyType() {
        return this.propertyType;
    }

    public CriteriaProperty propertyType(DataType propertyType) {
        this.setPropertyType(propertyType);
        return this;
    }

    public void setPropertyType(DataType propertyType) {
        this.propertyType = propertyType;
    }

    public String getDisplayNameDe() {
        return this.displayNameDe;
    }

    public CriteriaProperty displayNameDe(String displayNameDe) {
        this.setDisplayNameDe(displayNameDe);
        return this;
    }

    public void setDisplayNameDe(String displayNameDe) {
        this.displayNameDe = displayNameDe;
    }

    public String getDisplayNameEn() {
        return this.displayNameEn;
    }

    public CriteriaProperty displayNameEn(String displayNameEn) {
        this.setDisplayNameEn(displayNameEn);
        return this;
    }

    public void setDisplayNameEn(String displayNameEn) {
        this.displayNameEn = displayNameEn;
    }

    public String getDisplayNameFr() {
        return this.displayNameFr;
    }

    public CriteriaProperty displayNameFr(String displayNameFr) {
        this.setDisplayNameFr(displayNameFr);
        return this;
    }

    public void setDisplayNameFr(String displayNameFr) {
        this.displayNameFr = displayNameFr;
    }

    public String getDisplayNameIt() {
        return this.displayNameIt;
    }

    public CriteriaProperty displayNameIt(String displayNameIt) {
        this.setDisplayNameIt(displayNameIt);
        return this;
    }

    public void setDisplayNameIt(String displayNameIt) {
        this.displayNameIt = displayNameIt;
    }

    public Criteria getProperty() {
        return this.property;
    }

    public void setProperty(Criteria criteria) {
        this.property = criteria;
    }

    public CriteriaProperty property(Criteria criteria) {
        this.setProperty(criteria);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CriteriaProperty)) {
            return false;
        }
        return id != null && id.equals(((CriteriaProperty) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CriteriaProperty{" +
            "id=" + getId() +
            ", propertyName='" + getPropertyName() + "'" +
            ", propertyType='" + getPropertyType() + "'" +
            ", displayNameDe='" + getDisplayNameDe() + "'" +
            ", displayNameEn='" + getDisplayNameEn() + "'" +
            ", displayNameFr='" + getDisplayNameFr() + "'" +
            ", displayNameIt='" + getDisplayNameIt() + "'" +
            "}";
    }
}
