package com.vinay.intelliview.resume.entity;

import com.vinay.intelliview.common.BaseEntity;
import com.vinay.intelliview.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
public class Resume extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String targetRole;

    @Column(length = 100)
    private String jobTitle;

    @Column(length = 120)
    private String company;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    @Column(nullable = false, length = 255)
    private String originalFileName;

    @Column(nullable = false, unique = true, length = 255)
    private String storedFileName;

    @Column(nullable = false, length = 50)
    private String fileType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 500)
    private String storagePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ResumeStatus status;

    @Column
    private Integer atsScore;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @Column(nullable = false)
    private boolean aiProcessed = false;

}
